import { uuid, pgTable, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.js';

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password').notNull(),
  ...timestamps,
});
