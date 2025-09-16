import type { CookieOptions } from 'express';

import { type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import type { ApiResponseBody } from '@/lib/types/apiResponseBody.js';
import type { AuthService } from '@/services/auth.service.js';

import { authConst } from '@/lib/const.js';
import type { AuthCookies } from '@/lib/types/authCookies.js';

const ACCESS_TTL_SEC = 10 * 60;
const REFRESH_TTL_SEC = 10 * 24 * 60 * 60;
const ACCESS_TOKEN_NAME = authConst.ACCESS_TOKEN_NAME;
const REFRESH_TOKEN_NAME = authConst.REFRESH_TOKEN_NAME;

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

export default class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signUp(
    req: Request<object, ApiResponseBody<undefined>, SignUpRequest>,
    res: Response<ApiResponseBody<undefined>>
  ) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.signUp(email, password);

      res.status(result.statusHeader);

      console.log(result);

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

    try {
      await this.authService.signOut(req.cookies);

      res.clearCookie(ACCESS_TOKEN_NAME, accessCookieOptions as CookieOptions);
      res.clearCookie(REFRESH_TOKEN_NAME, refreshCookieOptions as CookieOptions);

      return res.status(StatusCodes.NO_CONTENT).send('OK');
    } catch (error) {
      console.log(error);

      res.clearCookie(ACCESS_TOKEN_NAME, accessCookieOptions as CookieOptions);
      res.clearCookie(REFRESH_TOKEN_NAME, accessCookieOptions as CookieOptions);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal error' });
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async refresh(req: Express.Request & { cookies: AuthCookies }, res: Response) {
    console.log(req.cookies);

    res.json({ message: 'ok' });
  }
}
