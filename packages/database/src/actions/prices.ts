'use server';

import { cyclePrices } from '../schema';
import { db } from '../drizzle';
import { eq, desc, and } from 'drizzle-orm';

export async function getPrices(cycle: number): Promise<any[]> {
  const result = await db.select().from(cyclePrices).where(eq(cyclePrices.cycle, cycle));
  return result;
}

export async function getPrice(cycle: number, symbol: string): Promise<number> {
  const result = await db
    .select()
    .from(cyclePrices)
    .where(and(eq(cyclePrices.cycle, cycle), eq(cyclePrices.symbol, symbol)))
    .limit(1);
  return result[0]?.price ?? 0;
}

export async function getPriceLatestCycle(symbol: string): Promise<number> {
  const result = await db
    .select()
    .from(cyclePrices)
    .where(eq(cyclePrices.symbol, symbol))
    .orderBy(desc(cyclePrices.cycle))
    .limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].cycle;
}

export async function savePrice(cycle: number, symbol: string, price: number): Promise<any> {
  const result = await db
    .insert(cyclePrices)
    .values({
      cycle: cycle,
      symbol: symbol,
      price: price,
    })
    .onConflictDoNothing();
  return result;
}
