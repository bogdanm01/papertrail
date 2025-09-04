import { pgTable, text, varchar, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.js';

export const notesTable = pgTable('notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text(),
  title: varchar().notNull(),
  ...timestamps,
});
