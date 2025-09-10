import { Router } from 'express';

import * as authController from '@/controllers/auth.controller.js';
import { validateBody } from '@/middlewares/validate.js';

const authRouter = Router();

/**
 * @openapi
 * auth/sign-up:
 *  post:
 *      summary: Sign user up
 *      tags: [Auth]
 *      description: Sign up endpoint
 *      requestBody:
 *          required: true,
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: Returns OK
 */
authRouter.post('/sign-up', validateBody(authController.SignUpSchema), authController.signUp);

/**
 * @openapi
 * auth/sign-in:
 *  post:
 *      summary: Sign user in
 *      tags: [Auth]
 *      description: Sign in endpoint
 *      responses:
 *          200:
 *              description: Returns OK
 */
authRouter.post('/sign-in', (req, res) => res.send({ message: 'Sign in' }));

authRouter.post('/sign-out', (req, res) => res.send({ message: 'Sign out' }));

export default authRouter;
