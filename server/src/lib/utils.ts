import type { $ZodType } from 'zod/v4/core';

import jwt from 'jsonwebtoken';
import z from 'zod';

import { authConsts } from './const.js';
import type { CookieOptions, Response } from 'express';

/**
 * Builds an OpenAPI request body definition that mandates JSON matching the provided Zod schema.
 *
 * @param schema - Zod schema describing the expected JSON payload.
 * @returns An object that can be spread into an OpenAPI route spec.
 */
export const requiredJSONBody = (schema: $ZodType) => {
  return {
    required: true,
    content: {
      'application/json': {
        schema: z.toJSONSchema(schema),
      },
    },
  };
};

/**
 * Creates a JSON Web Token (JWT) with the provided claims and signing options.
 *
 * @param claims - The JWT payload claims
 * @param claims.exp - Expiration time (Unix timestamp in seconds)
 * @param claims.iat - Issued at time (Unix timestamp in seconds)
 * @param claims.iss - Optional issuer claim. If not provided, defaults to authConst.TOKEN_ISSUER
 * @param claims.jti - Optional JWT ID claim for unique token identification
 * @param claims.sid - Session ID claim
 * @param claims.sub - Subject claim (typically user ID)
 * @param options - JWT signing options
 * @param options.algorithm - Optional signing algorithm. Defaults to 'HS256'
 * @param options.key - Secret key or private key used for signing the JWT
 *
 * @returns The signed JWT as a string
 *
 */
export const createJWT = (
  claims: {
    exp: number;
    iat: number;
    iss?: string;
    jti?: string;
    sid: string;
    sub: string;
  },
  options: {
    algorithm?: jwt.Algorithm;
    key: string;
  }
): string => {
  return jwt.sign({ ...claims, iss: claims.iss ?? authConsts.TOKEN_ISSUER }, options.key, {
    algorithm: options.algorithm ?? 'HS256',
  });
};

/**
 * Removes access and refresh cookies using the configured cookie options.
 *
 * @param res - Express response to clear cookies on.
 */
export const clearAuthCookies = (res: Response<any, Record<string, any>>) => {
  res.clearCookie(authConsts.ACCESS_TOKEN_NAME, authConsts.ACCESS_COOKIE_OPTIONS as CookieOptions);
  res.clearCookie(authConsts.REFRESH_TOKEN_NAME, authConsts.REFRESH_COOKIE_OPTIONS as CookieOptions);
};
