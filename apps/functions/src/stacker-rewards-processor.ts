import type { Context, ScheduledEvent } from "aws-lambda";
import {
  getLatestRewardCycle,
  getLatestStackersRewardCycle,
  getRewardsForCycle,
  getStackersForRewards,
  saveStackerReward,
} from "@repo/database/src/actions";

async function processStackerRewardsHelper(cycleNumber: number) {
  const cycleRewards = await getRewardsForCycle(cycleNumber);

  const stackerInfo: { [key: string]: { signer: string; rewards: number } } =
    {};

  for (const cycleReward of cycleRewards) {
    const stackers = await getStackersForRewards(
      cycleReward.cycleNumber,
      cycleReward.rewardRecipient
    );

    const stacked = stackers.map((stacker: any) => stacker.stackedAmount);
    const totalStacked = stacked.reduce(
      (acc: number, current: number) => acc + current,
      0
    );

    for (const stacker of stackers) {
      const stackerRewardAmount =
        cycleReward.rewardAmount * (stacker.stackedAmount / totalStacked);

      if (!stackerInfo[stacker.stackerAddress]) {
        stackerInfo[stacker.stackerAddress] = {
          signer: stacker.signerKey,
          rewards: 0,
        };
      }

      stackerInfo[stacker.stackerAddress].rewards += stackerRewardAmount;
    }
  }

  for (const stackerAddress of Object.keys(stackerInfo)) {
    await saveStackerReward(
      cycleNumber,
      stackerInfo[stackerAddress].signer,
      stackerAddress,
      stackerInfo[stackerAddress].rewards
    );
  }
}

export async function processStackerRewards(
  _: ScheduledEvent,
  __: Context
): Promise<void> {
  // TODO: only process if block % 144 = 0

  // TODO: only process if complete history of rewards & signers is fetched

  const latestStackersRewardCycle = await getLatestStackersRewardCycle();
  const latestProcessedCycle = Math.max(latestStackersRewardCycle, 84);

  const cycleNumber = await getLatestRewardCycle();

  // Process last cycle again
  await processStackerRewardsHelper(latestProcessedCycle);

  // Process next cycle if needed
  if (cycleNumber > latestProcessedCycle) {
    await processStackerRewardsHelper(latestProcessedCycle + 1);
  }
}
