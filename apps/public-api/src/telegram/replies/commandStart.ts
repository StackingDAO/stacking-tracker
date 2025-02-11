import { RepliesHandler } from "../repliesHandler";
import * as stacks from "@repo/stacks";
import { fetchPrice } from "../../prices";
import * as db from "@repo/database";
import { getMessage } from "../templates/commandStart";
import { getPoxInfoForCycle } from "../../processors/pox";
import { sendMessageOptions } from "@repo/telegram";

export class CommandStart extends RepliesHandler {
  canHandleMessage(message: any) {
    const messageText = message.message?.text;
    if (messageText && messageText === "/start") {
      return true;
    }

    const callbackText = message.callback_query?.data;
    if (callbackText && JSON.parse(callbackText).command === "/start") {
      return true;
    }

    return false;
  }

  async getInfoForCycle(
    cycleNumber: number,
    stxPrice: number,
    btcPrice: number
  ) {
    const [stackers, rewards] = await Promise.all([
      db.getStackersForCycle(cycleNumber),
      db.getRewardsForCycle(cycleNumber),
    ]);

    const info: any = getPoxInfoForCycle(
      cycleNumber,
      stackers,
      rewards,
      stxPrice,
      btcPrice
    );
    info.apy =
      ((info.rewards_amount * btcPrice) / (info.stacked_amount * stxPrice)) *
      25 *
      100;
    return info;
  }

  async handleMessage(message: any) {
    const userId =
      message.message?.chat?.id ?? message.callback_query?.from?.id;

    const [stxPrice, btcPrice, pox, currentCycle] = await Promise.all([
      fetchPrice("STX"),
      fetchPrice("BTC"),
      stacks.getPox(),
      db.getSignersLatestCycle(),
      db.saveChat(userId),
    ]);

    const promises: any[] = [];
    for (let cycle = currentCycle; cycle > currentCycle - 5; cycle--) {
      promises.push(this.getInfoForCycle(cycle, stxPrice, btcPrice));
    }
    const results = await Promise.all(promises);

    const daysLeftRewardPhase = pox.next_cycle.blocks_until_reward_phase / 144;
    const blockHeightRewardPhase =
      pox.next_cycle.reward_phase_start_block_height;

    const replyMessage = getMessage({
      stxPrice: stxPrice,
      btcPrice: btcPrice,
      cycleNumber: results[0].cycle_number,
      daysLeftRewardPhase: daysLeftRewardPhase,
      blockHeightRewardPhase: blockHeightRewardPhase,
      stackedAmount: results[0].stacked_amount,
      rewardsAmount: results[0].rewards_amount,
      apy:
        (results[1].apy + results[2].apy + results[3].apy + results[4].apy) /
        4.0,
    });

    const options = [
      [
        {
          text: "↻ Refresh",
          callback_data: JSON.stringify({ command: "/start" }),
        },
      ],
      [
        {
          text: "Stacking Positions →",
          callback_data: JSON.stringify({ command: "/positions" }),
        },
      ],
      [
        {
          text: "Manage Wallet →",
          callback_data: JSON.stringify({ command: "/wallet" }),
        },
      ],
    ];

    sendMessageOptions(
      message.message?.chat?.id ?? message.callback_query?.from?.id,
      replyMessage,
      options
    );

    return true;
  }
}
