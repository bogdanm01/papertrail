import * as argon from 'argon2';
import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import type { User, UserInsert } from '@/data/entity.type.js';
import type { ApiResponse } from '@/lib/types/apiResponse.js';

import env from '@/config/env.js';
import db from '@/data/db.js';
import redisClient from '@/data/redisClient.js';
import { userTable } from '@/data/schema/user.schema.js';
import { createJWT } from '@/lib/utils.js';
import type { Session } from '@/lib/types/session.js';
import type { AuthCookies } from '@/lib/types/authCookies.js';

const ACCESS_TTL_SEC = 10 * 60;
const REFRESH_TTL_SEC = 10 * 24 * 60 * 60;
const ACCESS_TOKEN_NAME = 'papertrail_access';
const REFRESH_TOKEN_NAME = 'papertrail_refresh';

export class AuthService {
  //   constructor(private db: NodePgDatabase, private redisClient: any) {}

  async signUp(
    email: string,
    password: string
  ): Promise<ApiResponse<undefined> & { accessToken?: string; refreshToken?: string }> {
    try {
      const isEmailRegistered = (await db.$count(userTable, eq(userTable.email, email))) > 0;

      if (isEmailRegistered) {
        return {
          statusHeader: StatusCodes.BAD_REQUEST,
          responseBody: {
            success: false,
            message: 'Email address is already in use.',
          },
        };
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
        return {
          statusHeader: StatusCodes.INTERNAL_SERVER_ERROR,
          responseBody: {
            success: false,
            message: 'Failed to create user.',
          },
        };
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

      return {
        statusHeader: StatusCodes.OK,
        responseBody: {
          success: true,
          message: 'User registered successfully.',
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async signIn(
    email: string,
    password: string
  ): Promise<ApiResponse<undefined> & { accessToken?: string; refreshToken?: string }> {
    try {
      const user: undefined | User = await db.query.userTable.findFirst({
        where: eq(userTable.email, email),
      });

      if (!user) {
        return {
          statusHeader: StatusCodes.BAD_REQUEST,
          responseBody: {
            success: false,
            message: 'Incorrect user credentials.',
          },
        };
      }

      const passwordMatches: boolean = await argon.verify(user.password, password);

      if (!passwordMatches) {
        return {
          statusHeader: StatusCodes.BAD_REQUEST,
          responseBody: {
            success: false,
            message: 'Incorrect user credentials.',
          },
        };
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

      return {
        statusHeader: StatusCodes.OK,
        responseBody: {
          success: true,
          message: 'OK',
        },
        accessToken,
        refreshToken,
      };
    } catch (err) {
      console.log('signIn error', err);
      throw err;
    }
  }

  async signOut(cookies: AuthCookies) {
    try {
      const token: string | undefined = cookies[ACCESS_TOKEN_NAME];

      if (token) {
        const decoded = jwt.decode(token, { json: true });
        const sid = decoded?.sid as string;

        if (sid) {
          await redisClient.del(sid);
        }
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
