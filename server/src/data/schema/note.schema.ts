import { pgTable, text, varchar, uuid, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.js';
import { userTable } from './user.schema.js';

export const noteTable = pgTable('note', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text(),
  title: varchar().notNull(),
  createdBy: uuid().references((): AnyPgColumn => userTable.id),
  ...timestamps,
});
