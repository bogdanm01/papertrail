import type { Request, Response } from 'express';
import type { NextFunction } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';

import { TOKENS } from '@/config/diTokens.js';
import env from '@/config/env.js';
import type { RedisClient } from '@/data/redisClient.js';
import { authConsts } from '@/lib/const.js';
import type { AuthCookies } from '@/lib/interfaces/authCookies.js';
import { AppError } from '@/lib/errors/appError.js';

export type AuthMiddleware = ReturnType<typeof getAccessGuard>;

export const getAccessGuard = () => {
  const redisClient: RedisClient = container.resolve(TOKENS.redis);

  return async (req: Request & { cookies: AuthCookies }, res: Response, next: NextFunction) => {
    const accessToken = req.cookies[authConsts.ACCESS_TOKEN_NAME];
    let decoded: any;

    if (!accessToken) {
      throw new AppError(StatusCodes.UNAUTHORIZED);
    }

    // TODO: Test exp and issuer are verified
    try {
      decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_KEY, {
        algorithms: ['HS256'],
        issuer: authConsts.TOKEN_ISSUER,
        ignoreExpiration: false,
        clockTolerance: 5,
      });
    } catch (error: any) {
      throw new AppError(StatusCodes.UNAUTHORIZED, error.message);
    }

    if (!decoded.sid || !decoded.sub) {
      throw new AppError(StatusCodes.UNAUTHORIZED);
    }

    const session: string | null = await redisClient.get(decoded.sid);

    if (!session) {
      throw new AppError(StatusCodes.UNAUTHORIZED);
    }

    req.auth = {
      sessionId: decoded.sid,
      userId: decoded.sub,
    };

    return next();
  };
};
