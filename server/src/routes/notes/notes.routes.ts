import { Router } from 'express';

import * as notes from '../../controllers/note.controller.js';

const noteRouter = Router();

// noteRouter.get('/', notes.getAllNotes);

// noteRouter.get('/:id', notes.getNote);

export default noteRouter;
