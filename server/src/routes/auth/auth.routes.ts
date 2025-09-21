import { Router } from 'express';
import { container } from 'tsyringe';

import { AuthController } from '@/controllers/auth.controller.js';
import { validateBody } from '@/middlewares/validateRequestBody.js';

import { SignUpSchema } from '@/lib/zod/signUpSchema.js';
import { SignInSchema } from '@/lib/zod/signInSchema.js';
import { getAuthMiddleware } from '@/middlewares/auth.js';
import { StatusCodes } from 'http-status-codes';
import { getRefreshMiddleware } from '@/middlewares/refresh.js';

const getAuthRoutes = () => {
  const authRouter = Router();
  const authMiddleware = getAuthMiddleware();
  const refreshMiddleware = getRefreshMiddleware();
  const authController = container.resolve(AuthController);

  authRouter.post('/sign-up', validateBody(SignUpSchema), (req, res) => authController.signUp(req, res));

  authRouter.post('/sign-in', validateBody(SignInSchema), (req, res) => authController.signIn(req, res));

  authRouter.post('/sign-out', authMiddleware, (req, res) => authController.signOut(req, res));

  authRouter.post('/refresh', refreshMiddleware, (req, res) => authController.refresh(req, res));

  authRouter.get('/test', authMiddleware, (req: any, res) => {
    res.status(StatusCodes.OK).send({ message: 'authorized' });
  });

  return authRouter;
};

export default getAuthRoutes;
