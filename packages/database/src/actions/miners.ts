'use server';

import { minersBids, miners } from '../schema';
import { db } from '../drizzle';
import { and, gte, lte } from 'drizzle-orm';

export async function getMiners(afterBlock: number, beforeBlock: number): Promise<any> {
  const result = await db
    .select()
    .from(miners)
    .where(and(gte(miners.blockHeight, afterBlock), lte(miners.blockHeight, beforeBlock)));
  return result;
}

export async function getMinersBids(afterBlock: number, beforeBlock: number): Promise<any> {
  const result = await db
    .select()
    .from(minersBids)
    .where(and(gte(miners.blockHeight, afterBlock), lte(miners.blockHeight, beforeBlock)));
  return result;
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
  bidAmount: number
): Promise<any> {
  const result = await db
    .insert(minersBids)
    .values({
      blockHeight: blockHeight,
      bitcoinAddress: bitcoinAddress,
      bidAmount: bidAmount,
    })
    .onConflictDoNothing();
  return result;
}
