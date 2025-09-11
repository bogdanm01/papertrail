import { configDotenv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

const nodeEnv = process.env.NODE_ENV ?? 'development';
configDotenv({ path: `.env.${nodeEnv}.local` });

export default defineConfig({
  out: './src/data/migrations',
  schema: './dist/src/data/schema/**/*.js',
  dialect: 'postgresql',
  verbose: true,
  strict: true,
  dbCredentials: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    url: process.env.DATABASE_URL!,
  },
});
