import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV ?? 'development'}.local` });

export const { DB_URI, NODE_ENV, PORT } = process.env;
