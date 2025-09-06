import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV ?? 'development'}.local` });

export const { DATABASE_URL, NODE_ENV, PORT, ACCESS_TOKEN_KEY } = process.env;
