import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import { poxAddressToPool } from "../constants";

async function getPoolsInfoForCycle(cycleNumber: number, poxAddress: string) {
  const [stackers, rewards] = await Promise.all([
    db.getStackersForCycle(cycleNumber, {
      poxAddresses: [poxAddress],
    }),
    db.getRewardsForCycle(cycleNumber),
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

  return {
    cycle_number: cycleNumber,
    stackers_count: stackersCount,
    stacked_amount: stackedAmount,
    rewards_amount: rewardAmount,
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
  for (let cycle = currentCycle; cycle > 83; cycle--) {
    promises.push(getPoolsInfoForCycle(cycle, poxAddress));
  }

  const results = await Promise.all(promises);
  res.send({
    name: poxAddressToPool[poxAddress].name,
    logo: poxAddressToPool[poxAddress].logo,
    website: poxAddressToPool[poxAddress].website,
    cycles: results.reverse(),
  });
});

export default router;
