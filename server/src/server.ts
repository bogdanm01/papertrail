import 'reflect-metadata';

import cookieParser from 'cookie-parser';
import express from 'express';

import env from './config/env.js';
import getAuthRouter from './routes/auth/auth.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import logger from '@/config/logger.js';
import registerDependencies from './config/registerDependencies.js';
import setupScalar from './config/setupScalar.js';
import registerRoutes from './config/registerRoutes.js';

await registerDependencies().catch(err => {
  logger.error(err, 'Failed to register dependencies');
  process.exit(1);
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(helmet());

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cookieParser());

registerRoutes(app);

setupScalar(app);

app.use(errorHandler);

// TODO: Add NotFound handler

app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});

export default app;
