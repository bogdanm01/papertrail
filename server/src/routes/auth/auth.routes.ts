import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { container } from 'tsyringe';

import { AuthController } from '@/controllers/auth.controller.js';
import { getAuthMiddleware } from '@/middlewares/auth.js';
import { getRefreshMiddleware } from '@/middlewares/refresh.js';
import { validateRequestBody } from '@/middlewares/validateRequestBody.js';
import { SignInSchema } from '@/lib/zod/signInSchema.js';
import { SignUpSchema } from '@/lib/zod/signUpSchema.js';

const getAuthRouter = () => {
  const authRouter = Router();
  const authMiddleware = getAuthMiddleware();
  const refreshMiddleware = getRefreshMiddleware();
  const authController = container.resolve(AuthController);

  authRouter.post('/sign-up', validateRequestBody(SignUpSchema), (req, res) => authController.signUp(req, res));

  authRouter.post('/sign-in', validateRequestBody(SignInSchema), (req, res) => authController.signIn(req, res));

  authRouter.post('/sign-out', authMiddleware, (req, res) => authController.signOut(req, res));

  authRouter.post('/refresh', refreshMiddleware, (req, res) => authController.refresh(req, res));

  authRouter.get('/me', authMiddleware, authController.me);

  authRouter.get('/test', authMiddleware, (req: any, res) => {
    res.status(StatusCodes.OK).send({ message: 'authorized' });
  });

  return authRouter;
};

export default getAuthRouter;
