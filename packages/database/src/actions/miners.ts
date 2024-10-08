'use server';

import { minersBids, miners } from '../schema';
import { db } from '../drizzle';
import { and, desc, gte, lte, asc } from 'drizzle-orm';

export async function getMiners(afterBlock: number, beforeBlock: number): Promise<any> {
  const result = await db
    .select()
    .from(miners)
    .where(and(gte(miners.blockHeight, afterBlock), lte(miners.blockHeight, beforeBlock)));
  return result;
}

export async function getMinersFirstBlockHeight(): Promise<any> {
  const result = await db.select().from(miners).orderBy(asc(miners.blockHeight)).limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].blockHeight;
}

export async function getMinersLastBlockHeight(): Promise<any> {
  const result = await db.select().from(miners).orderBy(desc(miners.blockHeight)).limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].blockHeight;
}

export async function getMinersBids(afterBlock: number, beforeBlock: number): Promise<any> {
  const result = await db
    .select()
    .from(minersBids)
    .where(and(gte(minersBids.blockHeight, afterBlock), lte(minersBids.blockHeight, beforeBlock)));
  return result;
}

export async function getMinersBidsFirstBlockHeight(): Promise<any> {
  const result = await db.select().from(minersBids).orderBy(asc(minersBids.blockHeight)).limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].blockHeight;
}

export async function getMinersBidsLastBlockHeight(): Promise<any> {
  const result = await db.select().from(minersBids).orderBy(desc(minersBids.blockHeight)).limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].blockHeight;
}

export async function saveMiner(
  blockHeight: number,
  bitcoinAddress: string,
  rewardAmount: number,
  feesAmount: number
): Promise<any> {
  const result = await db
    .insert(miners)
    .values({
      blockHeight: blockHeight,
      bitcoinAddress: bitcoinAddress,
      rewardAmount: rewardAmount,
      feesAmount: feesAmount,
    })
    .onConflictDoNothing();
  return result;
}

export async function saveMinerBids(
  blockHeight: number,
  bitcoinAddress: string,
  bidAmount: number,
  feeAmount: number
): Promise<any> {
  const result = await db
    .insert(minersBids)
    .values({
      blockHeight: blockHeight,
      bitcoinAddress: bitcoinAddress,
      bidAmount: bidAmount,
      feeAmount: feeAmount,
    })
    .onConflictDoNothing();
  return result;
}
