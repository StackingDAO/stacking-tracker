'use server';

import { blocks } from '../schema';
import { db } from '../drizzle';
import { desc } from 'drizzle-orm';

export async function getLatestBlock(): Promise<any> {
  const result = await db.select().from(blocks).orderBy(desc(blocks.blockHeight)).limit(1);
  return result;
}

export async function saveBlock(height: number): Promise<any> {
  const result = await db.insert(blocks).values({ blockHeight: height }).onConflictDoNothing();
  return result;
}
