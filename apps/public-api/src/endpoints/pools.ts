import { Router, Request, Response } from "express";
import * as db from "@repo/database";

const poxAddressName = {
  bc1q9ll6ngymkla8mnk5fq6dwlhgr3yutuxvg3whz5: "StackingDAO",
  bc1qmv2pxw5ahvwsu94kq5f520jgkmljs3af8ly6tr: "Xverse Pool",
  bc1qs0kkdpsrzh3ngqgth7mkavlwlzr7lms2zv3wxe: "Fast Pool",
  bc1qs33quxgnwkrspgu82lmaczw7gtcfa88pll8fqm: "Planbetter Pool",
};

async function getPoolsInfoForCycle(cycleNumber: number) {
  const [stackers, rewards] = await Promise.all([
    db.getStackersForCycle(cycleNumber),
    db.getRewardsForCycle(cycleNumber),
  ]);

  const poxAddresses = [
    ...new Set(stackers.map((stacker: any) => stacker.poxAddress)),
  ];

  const pools: any[] = [];
  for (const poxAddress of poxAddresses) {
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

    if (poxAddressName[poxAddress as string]) {
      pools.push({
        name: poxAddressName[poxAddress as string] ?? "-",
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
    console.log("- ", pool);
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

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const currentCycle = await db.getSignersLatestCycle();

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > currentCycle - 6; cycle--) {
    promises.push(getPoolsInfoForCycle(cycle));
  }

  const results = await Promise.all(promises);

  res.send(results.reverse());
});

export default router;
