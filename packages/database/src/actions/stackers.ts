'use server';

import { stackers } from '../schema';
import { db } from '../drizzle';
import { eq, and } from 'drizzle-orm';

export async function getStackers(): Promise<any> {
  const result = await db.select().from(stackers);
  return result;
}

export async function getStackersForCycle(cycleNumber: number): Promise<any> {
  const result = await db.select().from(stackers).where(eq(stackers.cycleNumber, cycleNumber));
  return result;
}

export async function getStackersForSigner(signerKey: string): Promise<any> {
  const result = await db.select().from(stackers).where(eq(stackers.signerKey, signerKey));
  return result;
}

export async function getStackersForRewards(cycleNumber: number, poxAddress: string): Promise<any> {
  const result = await db
    .select()
    .from(stackers)
    .where(and(eq(stackers.cycleNumber, cycleNumber), eq(stackers.poxAddress, poxAddress)));
  return result;
}

export async function saveStacker(
  cycleNumber: number,
  signerKey: string,
  stackerAddress: string,
  stackedAmount: number,
  poxAddress: string,
  stackerType: string
): Promise<any> {
  const result = await db
    .insert(stackers)
    .values({
      cycleNumber: cycleNumber,
      signerKey: signerKey,
      stackerAddress: stackerAddress,
      stackedAmount: stackedAmount,
      poxAddress: poxAddress,
      stackerType: stackerType,
    })
    .onConflictDoNothing();
  return result;
}
