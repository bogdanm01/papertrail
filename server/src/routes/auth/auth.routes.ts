import { Router } from 'express';

import * as authController from '@/controllers/auth.controller.js';
import { validateBody } from '@/middlewares/validate.js';

const authRouter = Router();

authRouter.post('/sign-up', validateBody(authController.SignUpSchema), authController.signUp);

authRouter.post('/sign-in', validateBody(authController.SignInSchema), authController.signIn);

// authenticated endpoint, get user from cookie
authRouter.post('/sign-out', authController.signOut);

export default authRouter;
