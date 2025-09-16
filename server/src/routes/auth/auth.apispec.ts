import { requiredJSONBody } from '@/lib/utils.js';
import { SignInSchema } from '@/lib/zod/signInSchema.js';
import { SignUpSchema } from '@/lib/zod/signUpSchema.js';

export const authApiSpec = {
  '/auth/sign-up': {
    post: {
      summary: 'Sign user up',
      tags: ['Auth'],
      description: 'Sign up endpoint',
      requestBody: requiredJSONBody(SignUpSchema),
      responses: {
        ...response('201', 'Returns 201 Created'),
      },
    },
  },
  '/auth/sign-in': {
    post: {
      summary: 'Sign user in',
      tags: ['Auth'],
      description: 'Sign in endpoint',
      requestBody: requiredJSONBody(SignInSchema),
      responses: {
        ...response('200', 'Returns 200 OK'),
      },
    },
  },
  'auth/sign-out': {
    post: {
      summary: 'Sign user out',
      tags: ['Auth'],
      description: 'Sign out endpoint',
      parameters: [
        {
          name: 'papertrail_access',
          in: 'cookie',
          required: true,
          schema: { type: 'string' },
          description: 'Access token stored in httpOnly cookie',
        },
      ],
      responses: {
        ...response('204', 'Returns 204 No Content'),
        ...response('500', 'Returns 500 Internal Server Error'),
      },
    },
  },
  'auth/refresh': {
    post: {
      summary: 'Get new access token',
      tags: ['Auth'],
      description: 'Refresh endpoint',
      parameters: [
        {
          name: 'papertrail_access',
          in: 'cookie',
          required: true,
          schema: { type: 'string' },
          description: 'Access token stored in httpOnly cookie',
        },
        {
          name: 'papertrail_refresh',
          in: 'cookie',
          required: true,
          schema: { type: 'string' },
          description: 'Access token stored in httpOnly cookie',
        },
      ],
    },
  },
};

function response(code: string, description: string) {
  return {
    [code]: {
      description: description,
    },
  };
}
