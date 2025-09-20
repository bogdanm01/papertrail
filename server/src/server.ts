import type { OpenAPIV3 } from 'openapi-types';

import { apiReference } from '@scalar/express-api-reference';
import cookieParser from 'cookie-parser';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';

import env from './config/env.js';
import { baseOpenapiSpec } from './config/openApiSpec.js';
import noteRouter from './routes/notes/notes.routes.js';
import getDbClient from './data/db.js';
import getAuthRoutes from './routes/auth/auth.routes.js';
import getRedisClient from './data/redisClient.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cookieParser());

const db = getDbClient();
const redisClient = getRedisClient();

const authRoutes = getAuthRoutes(db, redisClient);

app.use('/api/v1/auth', authRoutes);
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

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

export default app;
