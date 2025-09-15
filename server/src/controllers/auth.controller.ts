import type { CookieOptions, RequestHandler } from 'express';

import * as argon from 'argon2';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import type { User, UserInsert } from '@/data/entity.type.js';
import type { ApiResponseBody } from '@/lib/types/apiResponseBody.js';

import env from '@/config/env.js';
import db from '@/data/db.js';
import redisClient from '@/data/redisClient.js';
import { userTable } from '@/data/schema/user.schema.js';

const ACCESS_TTL_SEC = 10 * 60;
const REFRESH_TTL_SEC = 10 * 24 * 60 * 60;
const DEFAULT_TOKEN_ISSUER = 'papertrail-api';
const ACCESS_TOKEN_NAME = 'papertrail_access';
const REFRESH_TOKEN_NAME = 'papertrail_refresh';

interface AuthCookies {
  [ACCESS_TOKEN_NAME]?: string;
  [REFRESH_TOKEN_NAME]?: string;
}

interface Session {
  user: string;
  refreshTokenJti: string;
  createdAt: string;
  updatedAt: null | string;
}

export const SignUpSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().min(8).nonempty(),
});

export const SignInSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty(),
});

type SignInRequest = z.infer<typeof SignInSchema>;
type SignUpRequest = z.infer<typeof SignUpSchema>;

// TODO: Move to util
const createJWT = (
  claims: {
    exp: number;
    iat: number;
    iss?: string;
    jti?: string;
    sid: string;
    sub: string;
  },
  options: {
    algorithm?: jwt.Algorithm;
    key: string;
  }
): string => {
  return jwt.sign({ ...claims, iss: claims.iss ?? DEFAULT_TOKEN_ISSUER }, options.key, {
    algorithm: options.algorithm ?? 'HS256',
  });
};

export const signUp: RequestHandler<object, ApiResponseBody<undefined>, SignUpRequest> = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmailRegistered = (await db.$count(userTable, eq(userTable.email, email))) > 0;

    if (isEmailRegistered) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email address is already in use.',
      });
    }

    const hashedPassword = await argon.hash(password, { type: argon.argon2id });

    const newUser: UserInsert = {
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: null,
    };

    const inserted = await db.insert(userTable).values(newUser).returning();
    const savedUser: undefined | User = inserted[0];

    if (!savedUser) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to create user.',
      });
    }

    const nowSec = Math.floor(new Date().getTime() / 1000);
    const sessionId = crypto.randomUUID();
    const refreshJti = crypto.randomUUID();

    const sessionObj: Session = {
      user: savedUser.id,
      refreshTokenJti: refreshJti,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    await redisClient.set(sessionId, JSON.stringify(sessionObj), {
      expiration: {
        type: 'EX',
        value: REFRESH_TTL_SEC,
      },
    });

    const accessToken = createJWT(
      { sub: savedUser.id, exp: nowSec + ACCESS_TTL_SEC, iat: nowSec, sid: sessionId },
      { key: env.ACCESS_TOKEN_KEY }
    );

    const refreshToken = createJWT(
      {
        sub: savedUser.id,
        exp: nowSec + REFRESH_TTL_SEC,
        iat: nowSec,
        sid: sessionId,
        jti: refreshJti,
      },
      { key: env.ACCESS_TOKEN_KEY }
    );

    // TODO: Add email verification flow
    res
      .status(StatusCodes.CREATED)
      .cookie(ACCESS_TOKEN_NAME, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api',
        maxAge: ACCESS_TTL_SEC * 1000,
      })
      .cookie(REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: REFRESH_TTL_SEC * 1000,
      })
      .json({ message: 'User registered', success: true });
  } catch (err) {
    console.log('signUp error', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};

export const signIn: RequestHandler<object, ApiResponseBody<undefined>, SignInRequest> = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user: undefined | User = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Incorrect user credentials.',
      });
    }

    const passwordMatches: boolean = await argon.verify(user.password, password);

    if (!passwordMatches) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Incorrect user credentials.',
      });
    }

    // TODO: Consider session number limit
    const sessionId = crypto.randomUUID();
    const refreshTokenJti = crypto.randomUUID();
    const nowSec = Math.floor(new Date().getTime() / 1000);

    const sessionObj: Session = {
      user: user.id,
      refreshTokenJti: refreshTokenJti,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };

    await redisClient.set(sessionId, JSON.stringify(sessionObj), {
      expiration: {
        type: 'EX',
        value: REFRESH_TTL_SEC,
      },
    });

    const accessToken = createJWT(
      { sub: user.id, exp: nowSec + ACCESS_TTL_SEC, iat: nowSec, sid: sessionId },
      { key: env.ACCESS_TOKEN_KEY }
    );

    const refreshToken = createJWT(
      {
        sub: user.id,
        exp: nowSec + REFRESH_TTL_SEC,
        iat: nowSec,
        sid: sessionId,
        jti: refreshTokenJti,
      },
      { key: env.ACCESS_TOKEN_KEY }
    );

    res
      .status(StatusCodes.OK)
      .cookie(ACCESS_TOKEN_NAME, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api',
        maxAge: ACCESS_TTL_SEC * 1000,
      })
      .cookie(REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/refresh',
        maxAge: REFRESH_TTL_SEC * 1000,
      })
      .json({ success: true, message: 'OK' });
  } catch (err) {
    console.log('signIn error', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};

export const signOut: RequestHandler = async (req: Express.Request & { cookies: AuthCookies }, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  };

  try {
    const token: string | undefined = req.cookies[ACCESS_TOKEN_NAME];

    if (token) {
      const decoded = jwt.decode(token, { json: true });
      const sid = decoded?.sid as string;

      if (sid) {
        await redisClient.del(sid);
      }
    }

    res.clearCookie(ACCESS_TOKEN_NAME, cookieOptions as CookieOptions);
    res.clearCookie(REFRESH_TOKEN_NAME, cookieOptions as CookieOptions);

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (err) {
    console.log('signOut error', err);

    res.clearCookie(ACCESS_TOKEN_NAME, cookieOptions as CookieOptions);
    res.clearCookie(REFRESH_TOKEN_NAME, cookieOptions as CookieOptions);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal error' });
  }
};
