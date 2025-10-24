import { NoteService } from '@/services/note.service.js';

export const TOKENS = {
  // Clients
  db: Symbol('DbClient'),
  redis: Symbol('RedisClient'),

  // Services
  authService: Symbol('AuthService'),
  noteService: Symbol('NoteService'),

  // Repositories
  userRepository: Symbol('UserRepository'),
  noteRepository: Symbol('NoteRepository'),
};
