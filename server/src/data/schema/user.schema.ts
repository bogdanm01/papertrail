import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from './timestamps.js';

export const userTable = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password').notNull(),
  ...timestamps,
});
