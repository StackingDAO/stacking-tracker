'use server';

import { telegramChats } from '../schema';
import { db } from '../drizzle';
import { eq, isNull, or, lt } from 'drizzle-orm';

export async function getChat(chatId: bigint): Promise<any> {
  const result = await db
    .select()
    .from(telegramChats)
    .where(eq(telegramChats.chatId, chatId))
    .limit(1);
  return result[0];
}

export async function getChatsNotificationCycle(cycle: number): Promise<any> {
  const result = await db
    .select()
    .from(telegramChats)
    .where(or(isNull(telegramChats.notificationCycle), lt(telegramChats.notificationCycle, cycle)));
  return result;
}

export async function getChatsBlockStackingDaoRewards(block: number): Promise<any> {
  const result = await db
    .select()
    .from(telegramChats)
    .where(
      or(
        isNull(telegramChats.blockStackingDaoRewards),
        lt(telegramChats.blockStackingDaoRewards, block)
      )
    );
  return result;
}

export async function saveChat(
  chatId: bigint,
  addresses: string | undefined = undefined,
  notificationCycle: number | undefined = undefined,
  blockStackingDaoRewards: number | undefined = undefined
): Promise<any> {
  const updateValues: Partial<{
    addresses: string;
    notificationCycle: number;
    blockStackingDaoRewards: number;
  }> = {};

  if (addresses !== undefined) {
    updateValues.addresses = addresses;
  }

  if (notificationCycle !== undefined) {
    updateValues.notificationCycle = notificationCycle;
  }

  if (blockStackingDaoRewards !== undefined) {
    updateValues.blockStackingDaoRewards = blockStackingDaoRewards;
  }

  if (Object.keys(updateValues).length === 0) {
    const result = await db.insert(telegramChats).values({ chatId }).onConflictDoNothing();
    return result;
  } else {
    const result = await db
      .insert(telegramChats)
      .values({
        chatId: chatId,
        ...updateValues,
      })
      .onConflictDoUpdate({
        target: [telegramChats.chatId],
        set: updateValues,
      });
    return result;
  }
}
