import { drizzle } from 'drizzle-orm/postgres-js';
import dotenv from 'dotenv';
import postgres from 'postgres';
import * as schema from './schema';

dotenv.config();

const client = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(client, { schema });
