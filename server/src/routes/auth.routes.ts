import { Router } from 'express';

const authRouter = Router();

/**
 * @openapi
 * auth/sign-up:
 *  post:
 *      summary: Sign up
 *      tags: [Auth]
 *      description: Sign up endpoint
 *      responses:
 *          200:
 *              description: Returns OK
 */
authRouter.post('/sign-up', (req, res) => res.send({ message: 'Sign up' }));

/**
 * @openapi
 * auth/sign-in:
 *  post:
 *      summary: Sign in
 *      tags: [Auth]
 *      description: Sign in endpoint
 *      responses:
 *          200:
 *              description: Returns OK
 */
authRouter.post('/sign-in', (req, res) => res.send({ message: 'Sign in' }));

authRouter.post('/sign-out', (req, res) => res.send({ message: 'Sign out' }));

export default authRouter;
