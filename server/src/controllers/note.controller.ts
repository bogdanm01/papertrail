import db from '@/data/db.js';
import { notesTable } from '@/data/schema/note.schema.js';
import { type RequestHandler } from 'express';

export type NoteSelect = typeof notesTable.$inferSelect;

export const getAllNotes: RequestHandler = async (req, res) => {
  const notes: NoteSelect[] = await db.select().from(notesTable);
  res.status(200).send({ data: notes });
};

export const getNote: RequestHandler = (req, res) => {
  res.send('OK');
};
