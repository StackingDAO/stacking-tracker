import { poxAddressToPool } from "../constants";

export function getPoxInfoForCycle(
  cycleNumber: number,
  stackers: any,
  rewards: any,
  stackerType?: string | undefined
) {
  let poxAddresses = [
    ...new Set(stackers.map((stacker: any) => stacker.poxAddress)),
  ];

  if (stackerType) {
    poxAddresses = [
      ...new Set(
        stackers
          .filter((stacker: any) => stacker.stackerType === stackerType)
          .map((stacker: any) => stacker.poxAddress)
      ),
    ];
  }

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
  const apy = (previousRewardsValue / previousStackedValue) * 25 * 100;

  return apy;
}