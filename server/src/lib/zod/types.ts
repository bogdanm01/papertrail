import type z from 'zod';
import type { SignInSchema } from './signInSchema.js';
import type { SignUpSchema } from './signUpSchema.js';

export type SignInRequest = z.infer<typeof SignInSchema>;
export type SignUpRequest = z.infer<typeof SignUpSchema>;
