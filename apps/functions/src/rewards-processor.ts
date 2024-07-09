import type { Context, ScheduledEvent } from "aws-lambda";
import * as stacksPox from "@repo/stacks/src/pox";
import * as stacksBlocks from "@repo/stacks/src/blocks";
import { saveRewards } from "@repo/database/src/actions";

export async function processRewards(
  _: ScheduledEvent,
  __: Context
): Promise<void> {
  // TODO: 842351 is block of cycle 84
  const rewards = await stacksPox.getBurnchainRewards(842351);

  const cycles = await stacksPox.getCycles();

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
