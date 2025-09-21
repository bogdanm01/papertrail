import type { CookieOptions, Request, Response } from 'express';
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

export type RefreshMiddleware = ReturnType<typeof getRefreshMiddleware>;

export const getRefreshMiddleware = () => {
  const redisClient: RedisClient = container.resolve(TOKENS.redis);

  return async (req: Request & { cookies: AuthCookies }, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies[authConsts.REFRESH_TOKEN_NAME];

      if (!refreshToken) {
        return res.status(StatusCodes.UNAUTHORIZED).send();
      }

      const decoded: any = jwt.verify(refreshToken, env.REFRESH_TOKEN_KEY, {
        algorithms: ['HS256'],
        issuer: authConsts.TOKEN_ISSUER,
        ignoreExpiration: false,
        clockTolerance: 5,
      });

      if (!decoded.sub || !decoded.jti || !decoded.sid) {
        return res.status(StatusCodes.UNAUTHORIZED).send();
      }

      const session = await redisClient.get(decoded.sid);

      if (!session) {
        return res.status(StatusCodes.UNAUTHORIZED).send();
      }

      const sessionObj: Session = JSON.parse(session);

      if (decoded.jti !== sessionObj.refreshTokenJti) {
        await redisClient.del(decoded.sid);

        res.clearCookie(authConsts.ACCESS_TOKEN_NAME, authConsts.ACCESS_COOKIE_OPTIONS as CookieOptions);
        res.clearCookie(authConsts.REFRESH_TOKEN_NAME, authConsts.REFRESH_COOKIE_OPTIONS as CookieOptions);

        return res.status(StatusCodes.UNAUTHORIZED).send();
      }

      return next();
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.UNAUTHORIZED).send();
    }
  };
};
