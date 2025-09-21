import 'reflect-metadata';

import { apiReference } from '@scalar/express-api-reference';
import cookieParser from 'cookie-parser';
import express from 'express';
import type { OpenAPIV3 } from 'openapi-types';
import swaggerJSDoc from 'swagger-jsdoc';
import { container } from 'tsyringe';

import { TOKENS } from './config/diTokens.js';
import env from './config/env.js';
import { baseOpenapiSpec } from './config/openApiSpec.js';
import getDbClient, { type DbClient } from './data/db.js';
import getRedisClient, { type RedisClient } from './data/redisClient.js';
import getAuthRoutes from './routes/auth/auth.routes.js';
import { AuthService } from './services/auth.service.js';

const dbClient = getDbClient();
const redisClient = await getRedisClient();

container.registerInstance<DbClient>(TOKENS.db, dbClient);
container.registerInstance<RedisClient>(TOKENS.redis, redisClient);
container.register(TOKENS.authService, { useClass: AuthService });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(helmet());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cookieParser());

const authRoutes = getAuthRoutes();

app.use('/api/v1/auth', authRoutes);

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
