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

export type AuthMiddleware = ReturnType<typeof getAccessGuard>;

export const getAccessGuard = () => {
  const redisClient: RedisClient = container.resolve(TOKENS.redis);

  return async (req: Request & { cookies: AuthCookies }, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies[authConsts.ACCESS_TOKEN_NAME];

      if (!accessToken) {
        return res.status(StatusCodes.UNAUTHORIZED).send();
      }

      // TODO: Test exp and issuer are verified
      const decoded: any = jwt.verify(accessToken, env.ACCESS_TOKEN_KEY, {
        algorithms: ['HS256'],
        issuer: authConsts.TOKEN_ISSUER,
        ignoreExpiration: false,
        clockTolerance: 5,
      });

      if (!decoded.sid || !decoded.sub) {
        return res.status(StatusCodes.UNAUTHORIZED).send();
      }

      const session: string | null = await redisClient.get(decoded.sid);

      if (!session) {
        return res.status(StatusCodes.UNAUTHORIZED).send();
      }

      req.auth = {
        sessionId: decoded.sid,
        userId: decoded.sub,
      };

      return next();
    } catch (error: any) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  };
};
