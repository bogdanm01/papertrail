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
import type { Session } from '@/lib/interfaces/session.js';
import { AppError } from '@/lib/errors/appError.js';
import { clearAuthCookies } from '@/lib/utils.js';
import logger from '@/config/logger.js';

export type RefreshMiddleware = ReturnType<typeof getRefreshGuard>;

export const getRefreshGuard = () => {
  const redisClient: RedisClient = container.resolve(TOKENS.redis);

  return async (req: Request & { cookies: AuthCookies }, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies[authConsts.REFRESH_TOKEN_NAME];
      let decodedRefreshToken: any;

      if (!refreshToken) {
        throw new AppError(StatusCodes.UNAUTHORIZED);
      }

      try {
        decodedRefreshToken = jwt.verify(refreshToken, env.REFRESH_TOKEN_KEY, {
          algorithms: ['HS256'],
          issuer: authConsts.TOKEN_ISSUER,
          ignoreExpiration: false,
          clockTolerance: 5,
        });
      } catch (error) {
        throw new AppError(StatusCodes.UNAUTHORIZED);
      }

      if (!decodedRefreshToken.sub || !decodedRefreshToken.jti || !decodedRefreshToken.sid) {
        throw new AppError(StatusCodes.UNAUTHORIZED);
      }

      const session = await redisClient.get(decodedRefreshToken.sid);

      if (!session) {
        throw new AppError(StatusCodes.UNAUTHORIZED);
      }

      const sessionObj: Session = JSON.parse(session);

      if (decodedRefreshToken.jti !== sessionObj.refreshTokenJti) {
        logger.warn('Refresh token reuse detected');

        await redisClient.del(decodedRefreshToken.sid);
        clearAuthCookies(res);

        // TODO: Test is this OK, will cookies clear?
        throw new AppError(StatusCodes.UNAUTHORIZED);
      }

      req.auth = {
        sessionId: decodedRefreshToken.sid,
        userId: decodedRefreshToken.sub,
        jti: decodedRefreshToken.jti,
      };

      return next();
    } catch (error) {
      clearAuthCookies(res);
      throw error;
    }
  };
};
