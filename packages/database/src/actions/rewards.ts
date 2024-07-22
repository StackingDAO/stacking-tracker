'use server';

import { rewards } from '../schema';
import { db } from '../drizzle';
import { asc, desc, eq } from 'drizzle-orm';

export async function getLatestRewardBurnBlock(): Promise<number> {
  const result = await db.select().from(rewards).orderBy(desc(rewards.burnBlockHeight)).limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].burnBlockHeight;
}

export async function getFirstRewardBurnBlock(): Promise<number> {
  const result = await db.select().from(rewards).orderBy(asc(rewards.burnBlockHeight)).limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].burnBlockHeight;
}

export async function getLatestRewardCycle(): Promise<number> {
  const result = await db.select().from(rewards).orderBy(desc(rewards.cycleNumber)).limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].cycleNumber;
}

export async function getRewards(): Promise<any> {
  const result = await db.select().from(rewards);
  return result;
}

export async function getRewardsForCycle(cycleNumber: number): Promise<any> {
  const result = await db.select().from(rewards).where(eq(rewards.cycleNumber, cycleNumber));
  return result;
}

export async function saveRewards(
  cycleNumber: number,
  burnBlockHeight: number,
  rewardRecipient: string,
  rewardAmount: number
): Promise<any> {
  const result = await db
    .insert(rewards)
    .values({
      cycleNumber: cycleNumber,
      burnBlockHeight: burnBlockHeight,
      rewardRecipient: rewardRecipient,
      rewardAmount: rewardAmount,
    })
    .onConflictDoNothing();
  return result;
}
