import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { container } from 'tsyringe';

import { AuthController } from '@/controllers/auth.controller.js';
import { getAccessGuard } from '@/middlewares/accessGuard.js';
import { getRefreshGuard } from '@/middlewares/refreshGuard.js';
import { validateRequestBody } from '@/middlewares/validateRequestBody.js';
import { SignInSchema } from '@/lib/zod/signInSchema.js';
import { SignUpSchema } from '@/lib/zod/signUpSchema.js';

const getAuthRouter = () => {
  const authRouter = Router();
  const authController = container.resolve(AuthController);

  const accessGuard = getAccessGuard();
  const refreshGuard = getRefreshGuard();

  authRouter.post('/sign-up', validateRequestBody(SignUpSchema), (req, res) => authController.signUp(req, res));

  authRouter.post('/sign-in', validateRequestBody(SignInSchema), (req, res) => authController.signIn(req, res));

  authRouter.post('/sign-out', accessGuard, (req, res) => authController.signOut(req, res));

  authRouter.post('/refresh', refreshGuard, (req, res) => authController.refresh(req, res));

  authRouter.get('/me', accessGuard, (req, res) => authController.me(req, res));

  return authRouter;
};

export default getAuthRouter;
