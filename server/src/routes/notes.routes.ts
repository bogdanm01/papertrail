import { getAllNotes, getNote } from '@/controllers/note.controller.js';
import { Router } from 'express';

const noteRouter = Router();

noteRouter.get('/', getAllNotes);

noteRouter.get('/:id', getNote);

export default noteRouter;
