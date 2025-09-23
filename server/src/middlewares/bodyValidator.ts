import type { RequestHandler } from 'express';
import type { ZodObject } from 'zod/v4';

import { z } from 'zod';

import type { ApiResponseBody } from '@/lib/interfaces/apiResponseBody.js';

export const validateBody = (schema: ZodObject): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // TODO: Throw custom ValidationError
      return res.status(400).json({ success: false, errors: z.flattenError(result.error) } as ApiResponseBody<never>);
    }

    req.body = result.data;
    next();
  };
};
