import { type RequestHandler } from 'express';

import type { Note } from '@/data/entity.type.js';

import db from '@/data/db.js';
import { noteTable } from '@/data/schema/note.schema.js';

export const getAllNotes: RequestHandler = async (req, res) => {
  const notes: Note[] = await db.select().from(noteTable);
  res.status(200).send({ data: notes });
};

export const getNote: RequestHandler = (req, res) => {
  res.send('OK');
};
