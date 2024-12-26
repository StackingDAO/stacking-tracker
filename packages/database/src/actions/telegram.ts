'use server';

import { telegramChats } from '../schema';
import { db } from '../drizzle';
import { eq, isNull, or, lt } from 'drizzle-orm';

export async function getChatsNotificationCycle(cycle: number): Promise<any> {
  const result = await db
    .select()
    .from(telegramChats)
    .where(or(isNull(telegramChats.notificationCycle), lt(telegramChats.notificationCycle, cycle)));
  return result;
}

export async function getChat(chatId: number): Promise<any> {
  const result = await db
    .select()
    .from(telegramChats)
    .where(eq(telegramChats.chatId, chatId))
    .limit(1);
  return result[0];
}

export async function saveChat(
  chatId: number,
  addresses: string | undefined = undefined,
  notificationCycle: number | undefined = undefined
): Promise<any> {
  const updateValues: Partial<{
    addresses: string;
    notificationCycle: number;
  }> = {};

  if (addresses !== undefined) {
    updateValues.addresses = addresses;
  }

  if (notificationCycle !== undefined) {
    updateValues.notificationCycle = notificationCycle;
  }

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
