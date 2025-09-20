import { Router } from 'express';

import AuthController from '@/controllers/auth.controller.js';

import { validateBody } from '@/middlewares/validate.js';
import { AuthService } from '@/services/auth.service.js';

import { SignUpSchema } from '@/lib/zod/signUpSchema.js';
import { SignInSchema } from '@/lib/zod/signInSchema.js';
import type { DbClient } from '@/data/db.js';
import type { RedisClient } from '@/data/redisClient.js';

const getAuthRoutes = (db: DbClient, redisClient: RedisClient) => {
  const authRouter = Router();

  // TODO: Implement dependency container
  const authService = new AuthService(db, redisClient);
  const authController = new AuthController(authService);

  authRouter.post('/sign-up', validateBody(SignUpSchema), (req, res) => authController.signUp(req, res));

  authRouter.post('/sign-in', validateBody(SignInSchema), (req, res) => authController.signIn(req, res));

  // TODO: authenticated endpoint, get user from cookie
  authRouter.post('/sign-out', (req, res) => authController.signOut(req, res));

  authRouter.post('/refresh', (req, res) => authController.refresh(req, res));

  return authRouter;
};

export default getAuthRoutes;
