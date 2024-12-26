import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import type { Context, ScheduledEvent } from "aws-lambda";
import { sendMessageOptions } from "@repo/telegram";
import { getCurrentCycle } from "@repo/stacks/src/pox";
import * as stacks from "@repo/stacks";

export async function processTelegram(
  _: ScheduledEvent,
  __: Context
): Promise<void> {
  const pox = await stacks.getPox();

  const nextCycle = pox.next_cycle.id;
  const currentBlock = pox.current_burnchain_block_height;
  const nextCycleStartBlock = pox.next_cycle.reward_phase_start_block_height;
  const endsInDays = (nextCycleStartBlock - currentBlock) / 144;

  const options = [
    [
      {
        text: "Overview →",
        callback_data: JSON.stringify({ command: "/start" }),
      },
      {
        text: "Stacking Positions →",
        callback_data: JSON.stringify({ command: "/positions" }),
      },
    ],
  ];

  const replyMessage = `ℹ️ The next PoX cycle (<b>${nextCycle}</b>) is starting in <b>~${Math.round(Number(endsInDays) * 100) / 100} days</b>.`;
  const messageResult = await sendMessageOptions(
    BigInt(787301392),
    replyMessage,
    options
  );
  console.log("Message result", messageResult);
}
