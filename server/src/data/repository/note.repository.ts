import { inject, injectable } from 'tsyringe';

import type { Note, NoteInsert } from '../entity.type.js';
import { GenericRepository } from './generic.repository.js';
import { TOKENS } from '@/config/diTokens.js';
import type { DbClient } from '../db.js';
import { noteTable } from '../schema/note.schema.js';

@injectable()
export class NoteRepository extends GenericRepository<Note, NoteInsert> {
  constructor(@inject(TOKENS.db) db: DbClient) {
    super(db, noteTable);
  }
}
