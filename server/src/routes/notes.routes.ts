import { Router } from 'express';

import * as notes from '../controllers/note.controller.js';

const noteRouter = Router();

/**
 * @openapi
 * notes/:
 *  get:
 *      summary: Get all notes
 *      tags: [Note]
 *      description: Retrieves all notes for current logged in user
 */
noteRouter.get('/', notes.getAllNotes);

noteRouter.get('/:id', notes.getNote);

export default noteRouter;
