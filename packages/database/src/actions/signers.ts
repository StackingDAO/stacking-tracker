'use server';

import { signers, rewards } from '../schema';
import { db } from '../drizzle';
import { desc, eq } from 'drizzle-orm';

export async function getLatestCycle(): Promise<number> {
  const result = await db.select().from(signers).orderBy(desc(signers.cycleNumber)).limit(1);
  if (result.length === 0) {
    return 0;
  }
  return result[0].cycleNumber;
}

export async function getSigners(): Promise<any> {
  const result = await db.select().from(signers);
  return result;
}

export async function getSigner(signerKey: string): Promise<any> {
  const result = await db.select().from(signers).where(eq(signers.signerKey, signerKey));
  return result;
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
