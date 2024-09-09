'use server';

import { telegramChats } from '../schema';
import { db } from '../drizzle';
import { eq } from 'drizzle-orm';

export async function getChat(chatId: number): Promise<any> {
  const result = await db
    .select()
    .from(telegramChats)
    .where(eq(telegramChats.chatId, chatId))
    .limit(1);
  return result[0];
}

export async function saveChat(chatId: number, addresses: string): Promise<any> {
  const result = await db
    .insert(telegramChats)
    .values({
      chatId: chatId,
      addresses: addresses,
    })
    .onConflictDoUpdate({
      target: [telegramChats.chatId],
      set: {
        addresses: addresses,
      },
    });
  return result;
}
