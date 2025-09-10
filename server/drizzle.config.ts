import { defineConfig } from 'drizzle-kit';
import env from '@/config/env.js';

export default defineConfig({
  out: './src/data/migrations',
  schema: './dist/src/data/schema/**/*.js',
  dialect: 'postgresql',
  verbose: true,
  strict: true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
