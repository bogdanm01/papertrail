import { Router } from 'express';
import { container } from 'tsyringe';

import { AuthController } from '@/controllers/auth.controller.js';
import { getAccessGuard } from '@/middlewares/accessGuard.js';
import { getRefreshGuard } from '@/middlewares/refreshGuard.js';
import { validateBody } from '@/middlewares/bodyValidator.js';
import { SignInSchema } from '@/lib/zod/signInSchema.js';
import { SignUpSchema } from '@/lib/zod/signUpSchema.js';

// TODO: Add rate limiting
const getAuthRouter = () => {
  const authRouter = Router();
  const authController = container.resolve(AuthController);

  const requireAuth = getAccessGuard();
  const requireRefresh = getRefreshGuard();

  authRouter.post('/sign-up', validateBody(SignUpSchema), (req, res) => authController.signUp(req, res));

  authRouter.post('/sign-in', validateBody(SignInSchema), (req, res) => authController.signIn(req, res));

  authRouter.post('/sign-out', requireAuth, (req, res) => authController.signOut(req, res));

  authRouter.get('/me', requireAuth, (req, res) => authController.me(req, res));

  authRouter.post('/refresh', requireRefresh, (req, res) => authController.refresh(req, res));

  return authRouter;
};

export default getAuthRouter;
