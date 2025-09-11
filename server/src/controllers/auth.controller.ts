import type { RequestHandler } from 'express';

import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import type { User, UserInsert } from '@/data/entity.type.js';
import type { ApiResponseBody } from '@/lib/types/apiResponseBody.js';

import envs from '@/config/env.js';
import db from '@/data/db.js';
import redisClient from '@/data/redisClient.js';
import { userTable } from '@/data/schema/user.schema.js';

export const SignUpSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().min(8).nonempty(),
});

type SignUpRequest = z.infer<typeof SignUpSchema>;

const ACCESS_TTL_SEC = 10 * 60;
const REFRESH_TTL_SEC = 10 * 24 * 60 * 60;

export const signUp: RequestHandler<object, ApiResponseBody<any | undefined>, SignUpRequest> = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmailRegistered = (await db.$count(userTable, eq(userTable.email, email))) > 0;

    if (isEmailRegistered) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email address is already in use.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // use Argon2id instead

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

    await redisClient.set(
      sessionId,
      JSON.stringify({
        user: savedUser.id,
        status: 'active',
        refreshTokenJti: refreshJti,
        createdAt: new Date().toISOString(),
      }),
      {
        expiration: {
          type: 'EX',
          value: REFRESH_TTL_SEC,
        },
      }
    );

    const accessToken: string = jwt.sign(
      {
        sub: savedUser.id,
        iss: 'papertrail-api',
        exp: nowSec + ACCESS_TTL_SEC,
        iat: nowSec,
        sid: sessionId,
      },
      envs.ACCESS_TOKEN_KEY,
      { algorithm: 'HS256' }
    );

    const refreshToken = jwt.sign(
      {
        sub: savedUser.id,
        iss: 'papertrail-api',
        exp: nowSec + REFRESH_TTL_SEC,
        iat: nowSec,
        jti: refreshJti,
        sid: sessionId,
      },
      envs.REFRESH_TOKEN_KEY,
      {
        algorithm: 'HS256',
      }
    );

    res
      .status(StatusCodes.CREATED)
      .cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ACCESS_TTL_SEC * 1000,
      })
      .cookie('refresh', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: REFRESH_TTL_SEC * 1000,
      })
      .json({ message: 'User registered', success: true });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};
