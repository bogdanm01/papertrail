import { authConst } from '@/lib/const.js';
import { requiredJSONBody } from '@/lib/utils.js';
import { SignInSchema } from '@/lib/zod/signInSchema.js';
import { SignUpSchema } from '@/lib/zod/signUpSchema.js';

const ACCESS_COOKIE = authConst.ACCESS_TOKEN_NAME;
const REFRESH_COOKIE = authConst.REFRESH_TOKEN_NAME;

function response(code: string, description: string, extra: Record<string, any> = {}) {
  return {
    [code]: {
      description,
      ...extra,
    },
  };
}

export const authApiSpec = {
  'auth/sign-up': {
    post: {
      summary: 'Sign user up',
      tags: ['Auth'],
      description:
        'Creates a new user, a server session, and sets httpOnly cookies. **Returns Set-Cookie headers** for access and refresh.',
      requestBody: requiredJSONBody(SignUpSchema),
      responses: {
        ...response('201', 'User created. Cookies set.', {
          headers: {
            'Set-Cookie': {
              schema: { type: 'string' },
              description: `Two cookies are set:\n- \`${ACCESS_COOKIE}\` (path: \`/api\`, SameSite=Lax)\n- \`${REFRESH_COOKIE}\` (path: \`/api/v1/auth/refresh\`, SameSite=Lax)`,
            },
          },
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OkResponse' },
              examples: {
                default: {
                  value: { success: true, message: 'User registered successfully.' },
                },
              },
            },
          },
        }),
        ...response('400', 'Email already in use.', {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        }),
        ...response('500', 'Internal error.'),
      },
    },
  },

  'auth/sign-in': {
    post: {
      summary: 'Sign user in',
      tags: ['Auth'],
      description:
        'Authenticates user, creates a server session, and sets httpOnly cookies. **Returns Set-Cookie headers** for access and refresh.',
      requestBody: requiredJSONBody(SignInSchema),
      responses: {
        ...response('200', 'Authenticated. Cookies set.', {
          headers: {
            'Set-Cookie': {
              schema: { type: 'string' },
              description: `Two cookies are set:\n- \`${ACCESS_COOKIE}\` (path: \`/api\`, SameSite=Lax)\n- \`${REFRESH_COOKIE}\` (path: \`/api/v1/auth/refresh\`, SameSite=Lax)`,
            },
          },
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OkResponse' },
              examples: {
                default: { value: { success: true, message: 'OK' } },
              },
            },
          },
        }),
        ...response('400', 'Incorrect credentials.', {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        }),
        ...response('500', 'Internal error.'),
      },
    },
  },

  'auth/sign-out': {
    post: {
      summary: 'Sign user out',
      tags: ['Auth'],
      description:
        'Deletes the active server session (via access cookie’s `sid`) and clears cookies.\n\n**Method:** POST (state-changing, even with empty body).',
      security: [{ accessCookieAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/AccessCookie' }],
      responses: {
        ...response('204', 'No Content. Cookies cleared.', {
          headers: {
            'Set-Cookie': {
              schema: { type: 'string' },
              description: `Clears \`${ACCESS_COOKIE}\` (path: \`/api\`) and \`${REFRESH_COOKIE}\` (path: \`/api/v1/auth/refresh\`) by setting Max-Age=0.`,
            },
          },
        }),
        ...response('401', 'Missing or invalid access cookie.', {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        }),
        ...response('500', 'Internal error.'),
      },
    },
  },

  'auth/refresh': {
    post: {
      summary: 'Rotate/refresh access token',
      tags: ['Auth'],
      description: `Issues a new short-lived access cookie if the refresh cookie is valid and active.\n\n**Method:** POST (state-changing).\n\nOptionally rotates the refresh token (recommended).`,
      security: [{ refreshCookieAuth: [] }],
      parameters: [
        { $ref: '#/components/parameters/AccessCookieOptional' },
        { $ref: '#/components/parameters/RefreshCookie' },
      ],
      responses: {
        ...response('200', 'New access cookie issued.', {
          headers: {
            'Set-Cookie': {
              schema: { type: 'string' },
              description: `Sets a fresh \`${ACCESS_COOKIE}\` (path: \`/api\`). If rotation is enabled, also sets a new \`${REFRESH_COOKIE}\` (path: \`/api/v1/auth/refresh\`).`,
            },
          },
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OkResponse' },
              examples: {
                default: { value: { success: true, message: 'Access token refreshed.' } },
              },
            },
          },
        }),
        ...response('401', 'Missing/invalid/expired refresh cookie.', {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        }),
        ...response('403', 'Refresh token not allowed (e.g., session revoked).', {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        }),
        ...response('500', 'Internal error.'),
      },
    },
  },

  'auth/me': {
    get: {
      summary: 'Get current user (auth check)',
      tags: ['Auth'],
      description:
        'Returns a minimal profile for the authenticated user. Useful for app bootstrap. Requires access cookie.',
      security: [{ accessCookieAuth: [] }],
      parameters: [{ $ref: '#/components/parameters/AccessCookie' }],
      responses: {
        ...response('200', 'OK', {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MeResponse' },
              examples: {
                default: {
                  value: { success: true, data: { id: 'uuid', email: 'user@example.com' } },
                },
              },
            },
          },
        }),
        ...response('401', 'Missing/invalid access cookie.', {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
          },
        }),
      },
    },
  },

  components: {
    securitySchemes: {
      accessCookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: ACCESS_COOKIE,
        description: 'Short-lived access token stored in httpOnly cookie.',
      },
      refreshCookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: REFRESH_COOKIE,
        description: 'Long-lived refresh token stored in httpOnly cookie (path-limited to /api/v1/auth/refresh).',
      },
    },
    parameters: {
      AccessCookie: {
        name: ACCESS_COOKIE,
        in: 'cookie',
        required: true,
        schema: { type: 'string' },
        description: 'Access token (httpOnly cookie).',
      },
      AccessCookieOptional: {
        name: ACCESS_COOKIE,
        in: 'cookie',
        required: false,
        schema: { type: 'string' },
        description: 'Optional access cookie. If present & valid, can be used to correlate/rotate.',
      },
      RefreshCookie: {
        name: REFRESH_COOKIE,
        in: 'cookie',
        required: true,
        schema: { type: 'string' },
        description: 'Refresh token (httpOnly cookie).',
      },
    },
    schemas: {
      OkResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
        },
        required: ['success'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          code: { type: 'string', description: 'Optional machine-readable error code.' },
        },
        required: ['success', 'message'],
      },
      MeResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string', format: 'email' },
            },
            required: ['id', 'email'],
          },
        },
        required: ['success', 'data'],
      },
    },
  },
} as const;
