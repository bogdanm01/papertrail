import type { $ZodType } from 'zod/v4/core';

import z from 'zod';

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
