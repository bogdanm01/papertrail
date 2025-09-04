import type { OpenAPIV3 } from 'openapi-types';

import { apiReference } from '@scalar/express-api-reference';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';

import { PORT } from './config/env.js';
import { baseOpenapiSpec } from './config/swagger.js';
import noteRouter from './routes/notes.routes.js';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/notes', noteRouter);

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
  console.log(`Server running on http://localhost:${PORT?.toString()}`);
});

export default app;
