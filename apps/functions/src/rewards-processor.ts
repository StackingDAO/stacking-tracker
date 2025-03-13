import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import type { Context, ScheduledEvent } from "aws-lambda";
import * as stacksPox from "@repo/stacks/src/pox";
import * as stacksBlocks from "@repo/stacks/src/blocks";
import {
  getLatestRewardBurnBlock,
  getRewards,
  saveRewards,
} from "@repo/database";

async function processRewardsHelper(burnBlockEnd: number, offset: number) {
  const [rewards, cycles] = await Promise.all([
    stacksPox.getBurnchainRewards(burnBlockEnd, offset),
    stacksPox.getCycles(),
  ]);

  const cyclesInfoPromises = cycles.map(async (cycle: any) => {
    const block = await stacksBlocks.getBlock(cycle.block_height);
    return {
      cycle_number: cycle.cycle_number,
      burn_block_height: block.burn_block_height,
    };
  });

  const cyclesInfo = await Promise.all(cyclesInfoPromises);

  for (const reward of rewards) {
    const cycleInfo = cyclesInfo.filter(
      (cycle: any) =>
        reward.burn_block_height > cycle.burn_block_height &&
        reward.burn_block_height < cycle.burn_block_height + 2100
    )[0];

    await saveRewards(
      cycleInfo.cycle_number,
      reward.burn_block_height,
      reward.reward_recipient,
      reward.reward_amount / 100000000.0
    );
  }
}

export async function processRewards(
  _: ScheduledEvent,
  __: Context
): Promise<void> {
  const lastRewardBurnBlock = await getLatestRewardBurnBlock();

  await processRewardsHelper(lastRewardBurnBlock, 0);

  const savedRewardsCount = (await getRewards()).length;
  const offset = savedRewardsCount - 250;

  // 842351 = start of cycle 84
  await processRewardsHelper(842351, offset);
}
