import { drizzle } from 'drizzle-orm/node-postgres';
import { userTable } from '@/data/schema/user.schema.js';
import env from '../config/env.js';

export type DbClient = ReturnType<typeof getDbClient>;

const getDbClient = () => drizzle(env.DATABASE_URL, { schema: { userTable } });

export default getDbClient;
