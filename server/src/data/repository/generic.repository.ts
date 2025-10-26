import type { DbClient } from '../db.js';
import { type PgTableWithColumns } from 'drizzle-orm/pg-core';
import { and, eq, SQL } from 'drizzle-orm';

export class GenericRepository<TSelect, TInsert extends Record<string, any>> {
  constructor(
    protected db: DbClient,
    private readonly table: PgTableWithColumns<any>,
    private readonly idColumn: string = 'id'
  ) {}

  public async insert(obj: TInsert): Promise<TSelect> {
    return (await this.db.insert(this.table).values(obj).returning())[0] as TSelect;
  }

  public async find<TColumns extends Partial<Record<keyof TSelect, never>>>(
    select?: { [K in keyof TColumns]: (typeof this.table)[K] },
    filter?: SQL
  ): Promise<TSelect | Partial<TSelect> | null> {
    const selectQuery = select ? this.db.select(select as any) : this.db.select();
    const query = filter ? selectQuery.from(this.table).where(filter) : selectQuery.from(this.table);

    const rows = await query;
    return rows[0] ?? null;
  }

  public async findById<TColumns extends Partial<Record<keyof TSelect, never>>>(
    id: string,
    select?: { [K in keyof TColumns]: (typeof this.table)[K] },
    filter?: SQL
  ): Promise<TSelect | Partial<TSelect> | null> {
    const selectQuery = select ? this.db.select(select as any) : this.db.select();
    const whereClause = filter ? and(eq(this.table[this.idColumn], id), filter) : eq(this.table[this.idColumn], id);

    const rows = await selectQuery.from(this.table).where(whereClause).limit(1);
    return rows[0] ?? null;
  }
}
