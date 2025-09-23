import getAuthRouter from '@/routes/auth/auth.routes.js';
import type { Express } from 'express';

const registerRoutes = (app: Express) => {
  app.use('/api/v1/auth', getAuthRouter());
};

export default registerRoutes;
