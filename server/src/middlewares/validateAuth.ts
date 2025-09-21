import { authConst } from '@/lib/const.js';
import type { CookieOptions, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import env from '@/config/env.js';

import { container } from 'tsyringe';
import { TOKENS } from '@/config/diTokens.js';
import type { RedisClient } from '@/data/redisClient.js';
import type { Session } from '@/lib/interfaces/session.js';

export type AuthMiddleware = ReturnType<typeof getAuthMiddleware>;

const redisClient: RedisClient = container.resolve(TOKENS.redis);

export const getAuthMiddleware = (redisClient: RedisClient) => validateAuth;

export const validateAuth: RequestHandler = async (req, res, next) => {
  const accessCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api',
    maxAge: 0,
  };

  const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth/refresh',
    maxAge: 0,
  };

  const handleRefreshRoute: RequestHandler = async () => {
    const refreshToken = req.cookies[authConst.REFRESH_TOKEN_NAME];

    if (!refreshToken) {
      return res.status(StatusCodes.UNAUTHORIZED).send();
    }

    const decoded: any = jwt.verify(refreshToken, env.REFRESH_TOKEN_KEY, {
      algorithms: ['HS256'],
      issuer: authConst.TOKEN_ISSUER,
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
      res.clearCookie(authConst.ACCESS_TOKEN_NAME, accessCookieOptions as CookieOptions);
      res.clearCookie(authConst.REFRESH_TOKEN_NAME, refreshCookieOptions as CookieOptions);
    }

    return next();
  };

  try {
    if (req.originalUrl.endsWith('v1/auth/refresh')) {
      return await handleRefreshRoute(req, res, next);
    }

    const accessToken = req.cookies[authConst.ACCESS_TOKEN_NAME];

    if (!accessToken) {
      return res.status(StatusCodes.UNAUTHORIZED).send();
    }

    // TODO: Test exp and issuer are verified
    const accessDecoded: any = jwt.verify(accessToken, env.ACCESS_TOKEN_KEY, {
      algorithms: ['HS256'],
      issuer: authConst.TOKEN_ISSUER,
      ignoreExpiration: false,
      clockTolerance: 5,
    });

    if (!accessDecoded.sid || !accessDecoded.sub) {
      return res.status(StatusCodes.UNAUTHORIZED).send();
    }

    const session: string | null = await redisClient.get(accessDecoded.sid);

    if (!session) {
      return res.status(StatusCodes.UNAUTHORIZED).send();
    }

    return next();
  } catch (err: any) {
    console.log(err);
    return res.status(StatusCodes.UNAUTHORIZED).send();
  }
};
