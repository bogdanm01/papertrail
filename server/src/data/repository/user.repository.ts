import { inject, injectable } from 'tsyringe';
import type { User, UserInsert } from '../entity.type.js';
import { GenericRepository } from './generic.repository.js';
import { TOKENS } from '@/config/diTokens.js';
import { userTable } from '../schema/user.schema.js';
import type { DbClient } from '../db.js';
import { and, eq } from 'drizzle-orm';

@injectable()
export class UserRepository extends GenericRepository<User, UserInsert> {
  constructor(@inject(TOKENS.db) db: DbClient) {
    super(db, userTable);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    return result ?? null;
  }

  public async existsByEmail(email: string): Promise<Boolean> {
    const result = await this.db.$count(userTable, eq(userTable.email, email));
    return result > 0;
  }
}
