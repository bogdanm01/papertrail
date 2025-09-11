import { SignUpSchema } from '@/controllers/auth.controller.js';
import { requiredJSONBody } from '@/lib/utils.js';

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
      responses: {
        ...response('200', 'Returns 200 OK'),
      },
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
