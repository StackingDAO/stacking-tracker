import { sendMessageOptions } from "../api";
import { RepliesHandler } from "../repliesHandler";
import * as stacks from "@repo/stacks";
import { fetchPrice } from "../../prices";
import { poxAddressToPool } from "../../constants";
import * as db from "@repo/database";
import { getMessage } from "../templates/commandStart";

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

  async getInfoForCycle(cycleNumber: number) {
    const [stackers, rewards] = await Promise.all([
      db.getStackersForCycle(cycleNumber),
      db.getRewardsForCycle(cycleNumber),
    ]);

    const poxAddresses = [
      ...new Set(stackers.map((stacker: any) => stacker.poxAddress)),
    ];

    let poolsCount = 0;
    for (const poxAddress of poxAddresses) {
      if (poxAddressToPool[poxAddress as string]) {
        poolsCount++;
      }
    }

    let stackedAmount = 0.0;
    let rewardAmount = 0.0;
    stackers.forEach((stacker: any) => {
      stackedAmount += stacker.stackedAmount;
    });
    rewards.forEach((reward: any) => {
      rewardAmount += reward.rewardAmount;
    });

    return {
      cycle_number: cycleNumber,
      stacked_amount: stackedAmount,
      rewards_amount: rewardAmount,
      pools_count: poolsCount,
    };
  }

  async handleMessage(message: any) {
    const [stxPrice, btcPrice, pox, currentCycle] = await Promise.all([
      fetchPrice("STX"),
      fetchPrice("BTC"),
      stacks.getPox(),
      db.getSignersLatestCycle(),
    ]);

    const lastCyclesPromises = [
      this.getInfoForCycle(currentCycle),
      this.getInfoForCycle(currentCycle - 1),
      this.getInfoForCycle(currentCycle - 2),
      this.getInfoForCycle(currentCycle - 3),
      this.getInfoForCycle(currentCycle - 4),
    ];

    const lastCyclesInfo = await Promise.all(lastCyclesPromises);

    const currentCycleInfo = lastCyclesInfo[0];

    var previousStacked = 0.0;
    var previousRewards = 0.0;
    lastCyclesInfo.slice(1).forEach((info: any) => {
      previousStacked += info.stacked_amount;
      previousRewards += info.rewards_amount;
    });

    const previousStackedValue = (previousStacked / 4) * stxPrice;
    const previousRewardsValue = (previousRewards / 4) * btcPrice;
    // 25 cycles per year
    const apy = (previousRewardsValue / previousStackedValue) * 25 * 100;

    const daysLeftRewardPhase = pox.next_cycle.blocks_until_reward_phase / 144;
    const blockHeightRewardPhase =
      pox.next_cycle.reward_phase_start_block_height;

    const replyMessage = getMessage({
      stxPrice: stxPrice,
      btcPrice: btcPrice,
      cycleNumber: currentCycleInfo.cycle_number,
      daysLeftRewardPhase: daysLeftRewardPhase,
      blockHeightRewardPhase: blockHeightRewardPhase,
      stackedAmount: currentCycleInfo.stacked_amount,
      rewardsAmount: currentCycleInfo.rewards_amount,
      apy: apy,
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
          text: "Manage Wallet →",
          callback_data: JSON.stringify({ command: "/wallet" }),
        },
      ],
      [
        {
          text: "Stacking Positions →",
          callback_data: JSON.stringify({ command: "/positions" }),
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
