import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import { poxAddressToPool } from "../constants";
import { getPrices } from "../prices";

async function getPoolsInfoForCycle(cycleNumber: number, poxAddress: string) {
  const [stackers, rewards, prices] = await Promise.all([
    db.getStackersForCycle(cycleNumber, [poxAddress]),
    db.getRewardsForCycle(cycleNumber),
    getPrices(cycleNumber),
  ]);

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

  const rewardFeeMult = 1 - poxAddressToPool[poxAddress as string].fee;

  const previousStackedValue = stackedAmount * prices.stx;
  const previousRewardsValue = rewardAmount * rewardFeeMult * prices.btc;
  // 26 cycles per year
  const apr = (previousRewardsValue / previousStackedValue) * 26;
  const apy = (Math.pow(1 + apr / 26, 26) - 1) * 100.0;

  return {
    cycle_number: cycleNumber,
    stackers_count: stackersCount,
    stacked_amount: stackedAmount,
    rewards_amount: rewardAmount,
    apy: apy,
  };
}

const router = Router();

router.get("/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const poxAddress = Object.keys(poxAddressToPool).filter(
    (key: string) => poxAddressToPool[key].slug === slug
  )[0];

  const currentCycle = await db.getSignersLatestCycle();

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle >= 84; cycle--) {
    promises.push(getPoolsInfoForCycle(cycle, poxAddress));
  }

  const results = await Promise.all(promises);
  res.send({
    name: poxAddressToPool[poxAddress].name,
    logo: poxAddressToPool[poxAddress].logo,
    website: poxAddressToPool[poxAddress].website,
    fee: poxAddressToPool[poxAddress].fee,
    feeDisclosed: poxAddressToPool[poxAddress].feeDisclosed,
    cycles: results.reverse(),
  });
});

export default router;
