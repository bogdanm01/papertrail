import type { $ZodType } from 'zod/v4/core';

import jwt from 'jsonwebtoken';
import z from 'zod';

import { authConst } from './const.js';

export function requiredJSONBody(schema: $ZodType) {
  return {
    required: true,
    content: {
      'application/json': {
        schema: z.toJSONSchema(schema),
      },
    },
  };
}

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
  return jwt.sign({ ...claims, iss: claims.iss ?? authConst.TOKEN_ISSUER }, options.key, {
    algorithm: options.algorithm ?? 'HS256',
  });
};
