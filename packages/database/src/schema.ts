import { index, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const blocks = pgTable(
  'blocks',
  {
    blockHeight: integer('block_height').notNull(),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.blockHeight] }),
      createdIdx: index('created_at_idx').on(table.blockHeight).asc(),
    };
  }
);
