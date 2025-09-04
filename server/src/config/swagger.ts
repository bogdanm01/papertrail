import { type Options } from 'swagger-jsdoc';

export const baseOpenapiSpec: Options = {
  apis: ['src/routes/*.ts', 'src/openapi/**/*.yaml'],
  definition: {
    info: { description: 'API docs', title: 'My API', version: '1.0.0' },
    openapi: '3.0.3',
    servers: [{ url: 'http://localhost:5500/api/v1' }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Note', description: 'Note endpoints' },
    ],
  },
};
