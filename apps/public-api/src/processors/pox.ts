import { poxAddressToPool } from "../constants";

export function getPoxInfoForCycle(
  cycleNumber: number,
  stackers: any,
  rewards: any
) {
  let poxAddresses = [
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

export function getPoxApy(cyclesInfo: any, stxPrice: number, btcPrice: number) {
  var previousStacked = 0.0;
  var previousRewards = 0.0;
  cyclesInfo.forEach((info: any) => {
    previousStacked += info.stacked_amount;
    previousRewards += info.rewards_amount;
  });

  const previousStackedValue = (previousStacked / cyclesInfo.length) * stxPrice;
  const previousRewardsValue = (previousRewards / cyclesInfo.length) * btcPrice;
  // 25 cycles per year
  const apr = (previousRewardsValue / previousStackedValue) * 25;
  const apy = (Math.pow(1 + apr / 25, 25) - 1) * 100.0;
  return apy;
}
