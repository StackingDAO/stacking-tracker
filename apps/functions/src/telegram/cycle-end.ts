import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { sendMessageOptions } from "@repo/telegram";
import * as stacks from "@repo/stacks";
import * as db from "@repo/database";

export async function processCycleEnding(): Promise<void> {
  const pox = await stacks.getPox();
  const nextCycle = pox.next_cycle.id;
  const currentBlock = pox.current_burnchain_block_height;
  const nextCycleStartBlock = pox.next_cycle.reward_phase_start_block_height;
  const blocksLeft = nextCycleStartBlock - currentBlock;
  console.log(
    "[Telegram Cycle End] - Current block: ",
    currentBlock,
    "Next cycle start block:",
    nextCycleStartBlock
  );

  if (currentBlock < nextCycleStartBlock - 432) {
    return;
  }

  const telegramChats = await db.getChatsNotificationCycle(nextCycle);

  const options = [
    [
      {
        text: "Overview →",
        callback_data: JSON.stringify({ command: "/start" }),
      },
    ],
    [
      {
        text: "Stacking Positions →",
        callback_data: JSON.stringify({ command: "/positions" }),
      },
    ],
  ];

  const daysLeft = Math.round(Number(blocksLeft / 144) * 100) / 100;
  let replyMessage = `Stacking <b>cycle ${nextCycle}</b> is starting in ~${daysLeft} days!%0A%0A`;
  replyMessage += `That's <b>${blocksLeft} blocks left</b> to update your positions if needed.%0A%0A`;

  for (const chat of telegramChats) {
    const [messageResult] = await Promise.all([
      sendMessageOptions(BigInt(chat.chatId), replyMessage, options),
      await db.saveChat(chat.chatId, undefined, nextCycle),
    ]);

    console.log("[Telegram Cycle End] - Message results", messageResult);
  }
}
