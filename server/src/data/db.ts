import { drizzle } from 'drizzle-orm/node-postgres';

import env from '../config/env.js';

const db = drizzle(env.DATABASE_URL);

export default db;
