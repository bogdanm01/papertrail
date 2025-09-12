import { drizzle } from 'drizzle-orm/node-postgres';

import { userTable } from '@/data/schema/user.schema.js';

import env from '../config/env.js';

const db = drizzle(env.DATABASE_URL, { schema: { userTable } });

export default db;
