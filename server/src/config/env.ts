import { config } from 'dotenv';
import { z } from 'zod';

config({ path: `.env.${process.env.NODE_ENV ?? 'development'}.local` });

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.url(),
  PORT: z.string().default('3000'),
  ACCESS_TOKEN_KEY: z.string(),
  REFRESH_TOKEN_KEY: z.string(),
  REDIS_URL: z.string(),
  PINO_LOG_LEVEL: z.string().default('info'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

const env = EnvSchema.parse(process.env);

export default env;
