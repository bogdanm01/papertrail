import 'reflect-metadata';

import cookieParser from 'cookie-parser';
import express from 'express';

import env from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import logger from '@/config/logger.js';
import registerDependencies from './config/registerDependencies.js';
import setupScalar from './config/setupScalar.js';
import registerRoutes from './config/registerRoutes.js';
import helmet from 'helmet';

import cors from 'cors';

await registerDependencies().catch(err => {
  logger.error(err, 'Failed to register dependencies');
  process.exit(1);
});

const app = express();

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

registerRoutes(app);

setupScalar(app);

app.use(errorHandler);

// TODO: Add NotFound handler

app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
});

export default app;
