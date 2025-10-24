import 'reflect-metadata';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';

import logger from '@/config/logger.js';

import env from './config/env.js';
import registerDependencies from './config/registerDependencies.js';
import registerRoutes from './config/registerRoutes.js';
import setupScalar from './config/setupScalar.js';
import { errorHandler } from './middlewares/errorHandler.js';

const configureMiddleware = (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'script-src': [
            "'self'",
            ...(env.NODE_ENV === 'development'
              ? ['https://cdn.jsdelivr.net/npm/@scalar/api-reference', "'unsafe-inline'"]
              : []),
          ],
        },
      },
    })
  );
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(cookieParser());
};

const createApp = (): Application => {
  const app = express();

  configureMiddleware(app);
  registerRoutes(app);
  setupScalar(app);
  app.use(errorHandler);

  // TODO: Add NotFound handler

  return app;
};

await registerDependencies().catch(err => {
  logger.error(err, 'Failed to register dependencies');
  process.exit(1);
});

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});

export default app;
