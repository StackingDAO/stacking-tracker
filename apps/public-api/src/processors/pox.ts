import { poxAddressToPool } from "../constants";

export function getPoxInfoForCycle(
  cycleNumber: number,
  stackers: any,
  rewards: any,
  stxPrice: number,
  btcPrice: number
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

  const previousStackedValue = stackedAmount * stxPrice;
  const previousRewardsValue = rewardAmount * btcPrice;
  // 26 cycles per year
  const apr = (previousRewardsValue / previousStackedValue) * 26;
  const apy = (Math.pow(1 + apr / 26, 26) - 1) * 100.0;

  return {
    cycle_number: cycleNumber,
    stackers_count: stackers.length,
    stacked_amount: stackedAmount,
    stacked_amount_usd: stackedAmount * stxPrice,
    rewards_amount: rewardAmount,
    rewards_amount_usd: rewardAmount * btcPrice,
    pools_count: poolsCount,
    apr: apr * 100.0,
    apy: apy,
    stxPrice: stxPrice,
    btcPrice: btcPrice,
  };
}

export function getPoxApy(cyclesInfo: any, stxPrice: number, btcPrice: number) {
  var aprSum = 0.0;
  var apySum = 0.0;

  cyclesInfo.slice(1).forEach((info: any) => {
    aprSum += info.apr;
    apySum += info.apy;
  });

  return {
    apr: aprSum / cyclesInfo.slice(1).length,
    apy: apySum / cyclesInfo.slice(1).length,
  };
}
