import type { OpenAPIV3 } from 'openapi-types';

import { apiReference } from '@scalar/express-api-reference';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';

import authRouter from '@/routes/auth.routes.js';

import { PORT } from './config/env.js';
import { baseOpenapiSpec } from './config/swagger.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/auth', authRouter);

const openapiSpec: OpenAPIV3.Document = swaggerJSDoc(baseOpenapiSpec) as OpenAPIV3.Document;

app.get('/docs.json', (_req, res) => res.json(openapiSpec));

app.use(
  '/docs',
  apiReference({
    content: openapiSpec,
    layout: 'classic',
    theme: 'deepSpace',
  })
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT.toString()}`);
});

export default app;
