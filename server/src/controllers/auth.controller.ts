import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';

import { TOKENS } from '@/config/diTokens.js';
import { authConsts } from '@/lib/const.js';
import type { ApiResponseBody } from '@/lib/interfaces/apiResponseBody.js';
import type { AuthCookies } from '@/lib/interfaces/authCookies.js';
import type { SignInRequest, SignUpRequest } from '@/lib/zod/types.js';
import { AuthService } from '@/services/auth.service.js';
import { clearAuthCookies } from '@/lib/utils.js';

const ACCESS_TOKEN_NAME = authConsts.ACCESS_TOKEN_NAME;
const REFRESH_TOKEN_NAME = authConsts.REFRESH_TOKEN_NAME;

@injectable()
export class AuthController {
  constructor(@inject(TOKENS.authService) private readonly authService: AuthService) {}

  async signUp(
    req: Request<object, ApiResponseBody<undefined>, SignUpRequest>,
    res: Response<ApiResponseBody<undefined>>
  ) {
    const { email, password } = req.body;
    const result = await this.authService.signUp(email, password);

    res.status(result.statusHeader);

    if (result.accessToken && result.refreshToken) {
      res
        .cookie(ACCESS_TOKEN_NAME, result.accessToken, authConsts.ACCESS_COOKIE_OPTIONS)
        .cookie(REFRESH_TOKEN_NAME, result.refreshToken, authConsts.REFRESH_COOKIE_OPTIONS);
    }

    res.json(result.responseBody);
  }

  async signIn(
    req: Request<object, ApiResponseBody<undefined>, SignInRequest>,
    res: Response<ApiResponseBody<undefined>>
  ) {
    const { email, password } = req.body;
    const result = await this.authService.signIn(email, password);

    res.status(result.statusHeader);

    if (result.accessToken && result.refreshToken) {
      res
        .cookie(ACCESS_TOKEN_NAME, result.accessToken, authConsts.ACCESS_COOKIE_OPTIONS)
        .cookie(REFRESH_TOKEN_NAME, result.refreshToken, authConsts.REFRESH_COOKIE_OPTIONS);
    }

    res.json(result.responseBody);
  }

  async signOut(req: Express.Request & { cookies: AuthCookies }, res: Response) {
    try {
      const { sessionId } = req.auth;

      await this.authService.signOut(sessionId);

      clearAuthCookies(res);

      return res.status(StatusCodes.NO_CONTENT).send({ success: true });
    } catch (error) {
      clearAuthCookies(res);
      throw error;
    }
  }

  async refresh(req: Express.Request & { cookies: AuthCookies }, res: Response) {
    const { userId, sessionId, jti } = req.auth;
    const result = await this.authService.refresh(sessionId, userId, jti!);

    if (result.accessToken && result.refreshToken) {
      res
        .cookie(ACCESS_TOKEN_NAME, result.accessToken, authConsts.ACCESS_COOKIE_OPTIONS)
        .cookie(REFRESH_TOKEN_NAME, result.refreshToken, authConsts.REFRESH_COOKIE_OPTIONS);
    }

    res.status(result.statusHeader).json(result.responseBody);
  }

  async me(req: Request, res: Response) {
    const { userId, sessionId } = req.auth;
    const result = await this.authService.me(userId, sessionId);

    if (!result.responseBody.success) {
      clearAuthCookies(res);
    }

    res.status(result.statusHeader).json(result.responseBody);
  }
}
