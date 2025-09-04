import { drizzle } from 'drizzle-orm/node-postgres';

import { DATABASE_URL } from '../config/env.js';

if (!DATABASE_URL) {
  throw Error(`Provide DATABASE_URL`);
}

const db = drizzle(DATABASE_URL);

export default db;
