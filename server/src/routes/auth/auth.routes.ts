import { Router } from 'express';

import * as authController from '@/controllers/auth.controller.js';
import { validateBody } from '@/middlewares/validate.js';

const authRouter = Router();

authRouter.post('/sign-up', validateBody(authController.SignUpSchema), authController.signUp);

authRouter.post('/sign-in', (req, res) => res.send({ message: 'Sign in' }));

authRouter.post('/sign-out', (req, res) => res.send({ message: 'Sign out' }));

export default authRouter;
