import z from 'zod';

export const SignUpSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().min(8).nonempty(),
});
