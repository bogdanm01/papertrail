import { inject, injectable } from 'tsyringe';
import type { DbClient } from '../db.js';
import { TOKENS } from '@/config/diTokens.js';
import { userTable } from '../schema/user.schema.js';
import { PgTable, type PgTableWithColumns } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

export class GenericRepository<TSelect, TInsert extends Record<string, any>> {
  constructor(
    protected db: DbClient,
    private readonly table: PgTableWithColumns<any>,
    private readonly idColumn: string
  ) {}

  public async insert(obj: TInsert): Promise<TSelect> {
    return (await this.db.insert(this.table).values(obj).returning())[0] as TSelect;
  }

  public async findById(id: string): Promise<TSelect | null> {
    const rows = (await this.db
      .select()
      .from(this.table)
      .where(eq(this.table[this.idColumn], id))
      .limit(1)) as TSelect[];

    return rows[0] ?? null;
  }
}
