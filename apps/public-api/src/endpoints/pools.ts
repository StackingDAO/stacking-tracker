import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import { poxAddressToPool } from "../constants";
import { fetchPrice } from "../prices";

async function getPoolsInfoForCycle(cycleNumber: number) {
  const [stackers, rewards] = await Promise.all([
    db.getStackersForCycle(cycleNumber, {
      poxAddresses: Object.keys(poxAddressToPool),
    }),
    db.getRewardsForCycle(cycleNumber, Object.keys(poxAddressToPool)),
  ]);

  const pools: any[] = [];
  for (const poxAddress of Object.keys(poxAddressToPool)) {
    let stackedAmount = 0.0;
    let rewardAmount = 0.0;
    let stackersCount = 0;
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

    if (poxAddressToPool[poxAddress as string]) {
      pools.push({
        name: poxAddressToPool[poxAddress as string].name,
        stackers_count: stackersCount,
        pox_address: poxAddress,
        stacked_amount: stackedAmount,
        rewards_amount: rewardAmount,
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

async function getEntities(cyclesInfo: any) {
  const [stxPrice, btcPrice] = await Promise.all([
    fetchPrice("STX"),
    fetchPrice("BTC"),
  ]);

  const entities: any[] = [];
  for (const poxAddress of Object.keys(poxAddressToPool)) {
    const lastCycleInfo = cyclesInfo[0].pools.filter(
      (pool: any) => pool.pox_address === poxAddress
    )[0];

    const cycleInfoAddress = [];
    cyclesInfo.forEach((info: any) => {
      const filteredInfo = info.pools.filter(
        (pool: any) => pool.pox_address === poxAddress
      )[0];

      if (filteredInfo) {
        cycleInfoAddress.push(filteredInfo);
      }
    });

    var previousStacked = 0.0;
    var previousRewards = 0.0;
    cycleInfoAddress.slice(1).forEach((info: any) => {
      previousStacked += info.stacked_amount;
      previousRewards += info.rewards_amount;
    });

    const previousStackedValue = (previousStacked / 4) * stxPrice;
    const previousRewardsValue = (previousRewards / 4) * btcPrice;
    // 25 cycles per year
    const apy = (previousRewardsValue / previousStackedValue) * 25 * 100;

    entities.push({
      name: poxAddressToPool[poxAddress].name,
      entity: poxAddressToPool[poxAddress].entity,
      logo: poxAddressToPool[poxAddress].logo,
      slug: poxAddressToPool[poxAddress].slug,
      stackers_count: lastCycleInfo.stackers_count,
      stacked_amount: cycleInfoAddress[0].stacked_amount,
      rewards_amount: cycleInfoAddress[0].rewards_amount,
      stacked_amount_usd: cycleInfoAddress[0].stacked_amount * stxPrice,
      rewards_amount_usd: cycleInfoAddress[0].rewards_amount * btcPrice,
      apy: apy,
    });
  }

  return entities.sort((a, b) => b.stacked_amount - a.stacked_amount);
}

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const currentCycle = await db.getSignersLatestCycle();

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > 83; cycle--) {
    promises.push(getPoolsInfoForCycle(cycle));
  }

  const results = await Promise.all(promises);

  res.send({
    cycles: results.slice().reverse(),
    entities: await getEntities(results.slice(0, 5)),
  });
});

export default router;
