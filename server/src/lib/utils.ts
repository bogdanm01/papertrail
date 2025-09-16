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
