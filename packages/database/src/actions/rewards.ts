'use server';

import { rewards } from '../schema';
import { db } from '../drizzle';
import { desc, eq } from 'drizzle-orm';

export async function getRewards(): Promise<any> {
  const result = await db.select().from(rewards);
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
