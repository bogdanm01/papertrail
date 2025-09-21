import type { CookieOptions, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';

import { TOKENS } from '@/config/diTokens.js';
import { authConsts } from '@/lib/const.js';
import type { ApiResponseBody } from '@/lib/interfaces/apiResponseBody.js';
import type { AuthCookies } from '@/lib/interfaces/authCookies.js';
import type { SignInRequest, SignUpRequest } from '@/lib/zod/types.js';
import { AuthService } from '@/services/auth.service.js';

const ACCESS_TTL_SEC = authConsts.ACCESS_TTL_SEC;
const REFRESH_TTL_SEC = authConsts.REFRESH_TTL_SEC;
const ACCESS_TOKEN_NAME = authConsts.ACCESS_TOKEN_NAME;
const REFRESH_TOKEN_NAME = authConsts.REFRESH_TOKEN_NAME;

@injectable()
export class AuthController {
  constructor(@inject(TOKENS.authService) private readonly authService: AuthService) {}

  async signUp(
    req: Request<object, ApiResponseBody<undefined>, SignUpRequest>,
    res: Response<ApiResponseBody<undefined>>
  ) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.signUp(email, password);

      res.status(result.statusHeader);

      if (result.accessToken && result.refreshToken) {
        res
          .cookie(ACCESS_TOKEN_NAME, result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api',
            maxAge: ACCESS_TTL_SEC * 1000,
          })
          .cookie(REFRESH_TOKEN_NAME, result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api/v1/auth/refresh',
            maxAge: REFRESH_TTL_SEC * 1000,
          });
      }

      res.json(result.responseBody);
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(
    req: Request<object, ApiResponseBody<undefined>, SignInRequest>,
    res: Response<ApiResponseBody<undefined>>
  ) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.signIn(email, password);

      res.status(result.statusHeader);

      if (result.accessToken && result.refreshToken) {
        res
          .cookie(ACCESS_TOKEN_NAME, result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api',
            maxAge: ACCESS_TTL_SEC * 1000,
          })
          .cookie(REFRESH_TOKEN_NAME, result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: `/api/v1/auth/refresh`,
            maxAge: REFRESH_TTL_SEC * 1000,
          });
      }

      res.json(result.responseBody);
    } catch (err) {
      console.log('signIn error', err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  async signOut(req: Express.Request & { cookies: AuthCookies }, res: Response) {
    try {
      await this.authService.signOut(req.cookies);

      res.clearCookie(ACCESS_TOKEN_NAME, authConsts.ACCESS_COOKIE_OPTIONS as CookieOptions);
      res.clearCookie(REFRESH_TOKEN_NAME, authConsts.REFRESH_COOKIE_OPTIONS as CookieOptions);

      return res.status(StatusCodes.NO_CONTENT).send('OK');
    } catch (error) {
      console.log(error);

      res.clearCookie(ACCESS_TOKEN_NAME, authConsts.ACCESS_COOKIE_OPTIONS as CookieOptions);
      res.clearCookie(REFRESH_TOKEN_NAME, authConsts.REFRESH_COOKIE_OPTIONS as CookieOptions);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal error' });
    }
  }

  async refresh(req: Express.Request & { cookies: AuthCookies }, res: Response) {
    try {
      const refreshToken = req.cookies[REFRESH_TOKEN_NAME];

      if (!refreshToken) {
        return res.status(StatusCodes.FORBIDDEN).send();
      }

      const result = await this.authService.refresh(refreshToken);
      res.status(result.statusHeader);

      if (result.accessToken && result.refreshToken) {
        res
          .cookie(ACCESS_TOKEN_NAME, result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api',
            maxAge: ACCESS_TTL_SEC * 1000,
          })
          .cookie(REFRESH_TOKEN_NAME, result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: `/api/v1/auth/refresh`,
            maxAge: REFRESH_TTL_SEC * 1000,
          });
      }

      res.json(result.responseBody);
    } catch (err) {
      console.log('refresh error', err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  }

  async me(req: Request, res: Response) {}
}
