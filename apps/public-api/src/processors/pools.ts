import { poolsList } from "../constants";

export function getPoolsInfoForCycle(
  cycleNumber: number,
  stackers: any,
  rewards: any,
  stxPrice: number,
  btcPrice: number,
) {
  const pools: any[] = [];
  for (const pool of poolsList) {
    let stackedAmount = 0.0;
    let rewardAmount = 0.0;
    let stackersCount = 0;
    for (const poxAddress of pool.poxAddresses) {
      stackers
        .filter((stacker: any) => stacker.poxAddress === poxAddress)
        .forEach((stacker: any) => {
          stackedAmount += stacker.stackedAmount;
          stackersCount += 1;
        });
      rewards
        .filter((reward: any) => reward.rewardRecipient === poxAddress)
        .forEach((reward: any) => {
          rewardAmount += reward.rewardAmount;
        });
    }

    {
      const rewardFeeMult = 1 - pool.fee;

      const previousStackedValue = stackedAmount * stxPrice;
      const previousRewardsValue = rewardAmount * rewardFeeMult * btcPrice;
      // 26 cycles per year (use 0 when denominator is 0 to avoid NaN)
      const apr =
        previousStackedValue > 0 && Number.isFinite(previousStackedValue)
          ? (previousRewardsValue / previousStackedValue) * 26
          : 0;
      const rawApy = (Math.pow(1 + apr / 26, 26) - 1) * 100.0;
      const apy = Number.isFinite(rawApy) ? rawApy : 0;

      pools.push({
        name: pool.name,
        stackers_count: stackersCount,
        pox_address: pool.poxAddresses[0],
        stacked_amount: stackedAmount,
        rewards_amount: rewardAmount,
        apr: apr * 100.0,
        apy: apy ? apy : 0.0,
        slug: pool.slug,
      });
    }
  }

  pools.sort((a, b) => b.stacked_amount - a.stacked_amount);

  let stackedAmount = 0.0;
  let rewardAmount = 0.0;
  pools.forEach((pool: any) => {
    stackedAmount += pool.stacked_amount;
    rewardAmount += pool.rewards_amount;
  });

  return {
    cycle_number: cycleNumber,
    pools: pools,
    stacked_amount: stackedAmount,
    rewards_amount: rewardAmount,
  };
}

export function getAggregatedPoolsInfo(
  cyclesInfo: any[],
  stxPrice: number,
  btcPrice: number,
) {
  const aggregatedCyclesInfo: any[] = [];
  for (const cycle of cyclesInfo) {
    let otherStackersCount = 0;
    let otherStackedAmount = 0.0;
    let otherRewardsAmount = 0.0;
    const aggregatedPools: any[] = [];
    for (const pool of cycle.pools) {
      if (pool.stacked_amount < 1_000_000) {
        otherStackersCount += pool.stackers_count;
        otherStackedAmount += pool.stacked_amount;
        otherRewardsAmount += pool.rewards_amount;
      } else {
        aggregatedPools.push(pool);
      }
    }
    aggregatedPools.push({
      name: "Other",
      stackers_count: otherStackersCount,
      stacked_amount: otherStackedAmount,
      rewards_amount: otherRewardsAmount,
      stacked_amount_usd: otherStackedAmount * stxPrice,
      rewards_amount_usd: otherRewardsAmount * btcPrice,
    });

    aggregatedCyclesInfo.push({
      cycle_number: cycle.cycle_number,
      stacked_amount: cycle.stacked_amount,
      rewards_amount: cycle.rewards_amount,
      stacked_amount_usd: cycle.stacked_amount * stxPrice,
      rewards_amount_usd: cycle.rewards_amount * btcPrice,
      pools: aggregatedPools,
    });
  }
  return aggregatedCyclesInfo;
}

export function getPoolEntities(
  cyclesInfo: any,
  stxPrice: number,
  btcPrice: number,
) {
  const entities: any[] = [];
  for (const pool of poolsList) {
    const lastCycleInfo = cyclesInfo[0].pools.filter(
      (p: any) => p.slug === pool.slug,
    )[0];

    const cycleInfoAddress = [];
    cyclesInfo.forEach((info: any) => {
      const filteredInfo = info.pools.filter(
        (p: any) => p.slug === pool.slug,
      )[0];

      if (filteredInfo) {
        cycleInfoAddress.push(filteredInfo);
      }
    });

    var aprSum = 0.0;
    var apySum = 0.0;

    cycleInfoAddress.slice(1).forEach((info: any) => {
      aprSum += info.apr;
      apySum += info.apy;
    });

    entities.push({
      name: pool.name,
      entity: pool.entity,
      fee: pool.fee,
      feeDisclosed: pool.feeDisclosed,
      logo: pool.logo,
      website: pool.website,
      symbol: pool.symbol,
      slug: pool.slug,
      stackers_count: lastCycleInfo?.stackers_count ?? 0,
      stacked_amount: cycleInfoAddress[0]?.stacked_amount ?? 0,
      rewards_amount: cycleInfoAddress[0]?.rewards_amount ?? 0,
      stacked_amount_usd: (cycleInfoAddress[0]?.stacked_amount ?? 0) * stxPrice,
      rewards_amount_usd: (cycleInfoAddress[0]?.rewards_amount ?? 0) * btcPrice,
      apr:
        cycleInfoAddress.slice(1).length > 0
          ? aprSum / cycleInfoAddress.slice(1).length
          : 0,
      apy:
        cycleInfoAddress.slice(1).length > 0
          ? apySum / cycleInfoAddress.slice(1).length
          : 0,
    });
  }

  return entities.sort((a, b) => b.apy - a.apy);
}
