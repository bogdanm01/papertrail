import type { noteTable } from './schema/note.schema.js';
import type { userTable } from './schema/user.schema.js';

export type User = typeof userTable.$inferSelect;
export type UserInsert = typeof userTable.$inferInsert;

export type Note = typeof noteTable.$inferSelect;
export type NoteInsert = typeof noteTable.$inferInsert;
