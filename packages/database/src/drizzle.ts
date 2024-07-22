import { drizzle } from 'drizzle-orm/postgres-js';
import dotenv from 'dotenv';
import postgres from 'postgres';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

const client = isTest
  ? postgres(process.env.TEST_DATABASE_URL!)
  : process.env.DATABASE_URL!.includes('localhost')
    ? postgres(process.env.DATABASE_URL!, {})
    : postgres(process.env.DATABASE_URL!, {
        ssl: { rejectUnauthorized: false },
      });

export const db = drizzle(client, { schema: schema });

//
// Helpers
//

export async function clearDatabase() {
  if (!isTest) throw new Error('Can only be used in tests');

  const tablesSchema = db._.schema;
  if (!tablesSchema) throw new Error('Schema not loaded');

  const queries = Object.values(tablesSchema).map(table => {
    return sql.raw(`DELETE FROM ${table.dbName};`);
  });

  await db.transaction(async transaction => {
    await Promise.all(
      queries.map(async query => {
        if (query) await transaction.execute(query);
      })
    );
  });
}

export async function closeDatabase() {
  if (!isTest) throw new Error('Can only be used in tests');

  await client.end();
}
