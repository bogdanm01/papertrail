import type { Request, Response } from 'express';

import { TOKENS } from '@/config/diTokens.js';
import type { NoteService } from '@/services/note.service.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class NoteController {
  constructor(@inject(TOKENS.noteService) private noteService: NoteService) {}

  public async createNote(req: Request, res: Response) {
    await this.noteService.createNote({});
  }
}
