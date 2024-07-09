'use server';

import { signers, rewards } from '../schema';
import { db } from '../drizzle';
import { desc, eq } from 'drizzle-orm';

export async function getLatestCycle(): Promise<any> {
  const result = await db.select().from(signers).orderBy(desc(signers.cycleNumber)).limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].cycleNumber;
}

export async function getLatestRewardsBurnBlockHeight(rewardRecipient: string): Promise<any> {
  const result = await db
    .select()
    .from(rewards)
    .where(eq(rewards.rewardRecipient, rewardRecipient))
    .orderBy(desc(rewards.burnBlockHeight))
    .limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].burnBlockHeight;
}

export async function saveSigner(
  cycleNumber: number,
  signerKey: string,
  stackersCount: number,
  stackedAmount: number
): Promise<any> {
  const result = await db
    .insert(signers)
    .values({
      cycleNumber: cycleNumber,
      signerKey: signerKey,
      stackersCount: stackersCount,
      stackedAmount: stackedAmount,
    })
    .onConflictDoNothing();
  return result;
}
