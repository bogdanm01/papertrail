import { type Options } from 'swagger-jsdoc';

import { authApiSpec } from '@/routes/auth/auth.apispec.js';

export const baseOpenapiSpec: Options = {
  apis: ['src/routes/*.ts', 'src/openapi/**/*.yaml'],
  definition: {
    info: { description: 'RESTful API for Papertrail application.', title: 'Papertrail API', version: '1.0.0' },
    openapi: '3.0.3',
    servers: [{ url: 'http://localhost:5500/api/v1', description: 'Local' }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Note', description: 'Note endpoints' },
    ],
    paths: { ...authApiSpec },
  },
};
