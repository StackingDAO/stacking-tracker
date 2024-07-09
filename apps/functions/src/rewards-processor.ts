import type { Context, ScheduledEvent } from "aws-lambda";
import * as stacksPox from "@repo/stacks/src/pox";
import { saveRewards } from "@repo/database/src/actions";

export async function processRewards(
  _: ScheduledEvent,
  __: Context
): Promise<void> {
  // TODO
  const cycleNumber = 88;

  const rewards = await stacksPox.getBurnchainRewards();

  console.log("GOT REWARDS", rewards.length);

  for (const reward of rewards) {
    await saveRewards(
      cycleNumber,
      reward.burn_block_height,
      reward.reward_recipient,
      reward.reward_amount / 100000000.0
    );
  }
}
