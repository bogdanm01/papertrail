import { Router } from 'express';
import { container } from 'tsyringe';

import { AuthController } from '@/controllers/auth.controller.js';
import { validateBody } from '@/middlewares/validate.js';

import { SignUpSchema } from '@/lib/zod/signUpSchema.js';
import { SignInSchema } from '@/lib/zod/signInSchema.js';

const getAuthRoutes = () => {
  const authRouter = Router();

  const authController = container.resolve(AuthController);

  authRouter.post('/sign-up', validateBody(SignUpSchema), (req, res) => authController.signUp(req, res));

  authRouter.post('/sign-in', validateBody(SignInSchema), (req, res) => authController.signIn(req, res));

  // TODO: authenticated endpoint, get user from cookie
  authRouter.post('/sign-out', (req, res) => authController.signOut(req, res));

  authRouter.post('/refresh', (req, res) => authController.refresh(req, res));

  return authRouter;
};

export default getAuthRoutes;
