import type { Context, SNSEvent } from "aws-lambda";
import {
  getFirstRewardBurnBlock,
  getLatestRewardCycle,
  getLatestStackersRewardCycle,
  getRewardsForCycle,
  getSignersLatestCycle,
  getStackersForRewards,
  saveStackerReward,
} from "@repo/database/src/actions";
import { getCurrentCycle } from "@repo/stacks/src/pox";

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
  event: SNSEvent,
  __: Context
): Promise<void> {
  const eventBody = await JSON.parse(event.Records[0].Sns.Message);
  const eventBlockHeight = eventBody.block_height;

  // Only process once a day
  if (eventBlockHeight % 144 !== 0) {
    return;
  }

  const [
    currentCycle,
    firstRewardBurnBlock,
    signersLatestCycle,
    latestStackersRewardCycle,
    latestRewardCycle,
  ] = await Promise.all([
    getCurrentCycle(),
    getFirstRewardBurnBlock(),
    getSignersLatestCycle(),
    getLatestStackersRewardCycle(),
    getLatestRewardCycle(),
  ]);

  // Only process if signer and rewards history is fetched
  const hasFetchedHistory =
    firstRewardBurnBlock === 842451 && currentCycle === signersLatestCycle;
  if (!hasFetchedHistory) {
    return;
  }

  const latestProcessedCycle = Math.max(latestStackersRewardCycle, 84);

  // Process last cycle again
  await processStackerRewardsHelper(latestProcessedCycle);

  // Process next cycle if needed
  if (latestRewardCycle > latestProcessedCycle) {
    await processStackerRewardsHelper(latestProcessedCycle + 1);
  }
}
