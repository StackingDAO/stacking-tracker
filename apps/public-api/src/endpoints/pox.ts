import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import { poxAddressToPool } from "../constants";

async function getInfoForCycle(cycleNumber: number) {
  const [signers, stackers, rewards] = await Promise.all([
    db.getSignersForCycle(cycleNumber),
    db.getStackersForCycle(cycleNumber),
    db.getRewardsForCycle(cycleNumber),
  ]);

  const poxAddresses = [
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
    signers_count: signers.length,
    pools_count: poolsCount,
  };
}

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const currentCycle = await db.getSignersLatestCycle();

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > 83; cycle--) {
    promises.push(getInfoForCycle(cycle));
  }

  const results = await Promise.all(promises);
  res.send(results.reverse());
});

export default router;
