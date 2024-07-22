'use server';

import { stackers, stackersRewards } from '../schema';
import { db } from '../drizzle';
import { eq, and, desc } from 'drizzle-orm';

export async function getStackersRewards(): Promise<any> {
  const result = await db.select().from(stackersRewards);
  return result;
}

export async function getStackersRewardsForSigner(signerKey: string): Promise<any> {
  const result = await db
    .select()
    .from(stackersRewards)
    .where(eq(stackersRewards.signerKey, signerKey));
  return result;
}

export async function getLatestStackersRewardCycle(): Promise<number> {
  const result = await db
    .select()
    .from(stackersRewards)
    .orderBy(desc(stackersRewards.cycleNumber))
    .limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].cycleNumber;
}

export async function saveStackerReward(
  cycleNumber: number,
  signerKey: string,
  stackerAddress: string,
  rewardAmount: number
): Promise<any> {
  const result = await db
    .insert(stackersRewards)
    .values({
      cycleNumber: cycleNumber,
      signerKey: signerKey,
      stackerAddress: stackerAddress,
      rewardAmount: rewardAmount,
    })
    .onConflictDoUpdate({
      target: [
        stackersRewards.cycleNumber,
        stackersRewards.signerKey,
        stackersRewards.stackerAddress,
      ],
      set: {
        rewardAmount: rewardAmount,
      },
    });
  return result;
}
