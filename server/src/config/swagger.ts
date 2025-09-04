import { type Options } from 'swagger-jsdoc';

export const baseOpenapiSpec: Options = {
  apis: ['src/routes/*.ts', 'src/openapi/**/*.yaml'],
  definition: {
    info: { description: 'API docs', title: 'My API', version: '1.0.0' },
    openapi: '3.0.3',
    servers: [{ url: 'http://localhost:3000/api/v1' }],
    tags: [{ description: 'Authentication endpoints', name: 'Auth' }],
  },
};
