import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import { signerKeyToPool } from "../constants";

async function getSignersInfoForCycle(cycleNumber: number) {
  const [signers, rewards] = await Promise.all([
    db.getSignersForCycle(cycleNumber),
    db.getStackersRewardsForCycle(cycleNumber),
  ]);

  const resultSigners: any[] = [];
  for (const signer of signers) {
    const signerRewards = rewards.filter(
      (reward: any) => reward.signerKey === signer.signerKey
    );

    let signerRewardsAmount = 0;
    signerRewards.forEach((reward: any) => {
      signerRewardsAmount += reward.rewardAmount;
    });

    if (signerKeyToPool[signer.signerKey as string]) {
      resultSigners.push({
        name: signerKeyToPool[signer.signerKey as string].name,
        slug: signerKeyToPool[signer.signerKey as string].slug,
        logo: signerKeyToPool[signer.signerKey as string].logo,
        group: signerKeyToPool[signer.signerKey as string].group,
        signer_key: signer.signerKey,
        stackers_count: signer.stackersCount,
        stacked_amount: signer.stackedAmount,
        rewards_amount: signerRewardsAmount,
      });
    } else {
      resultSigners.push({
        signer_key: signer.signerKey,
        stackers_count: signer.stackersCount,
        stacked_amount: signer.stackedAmount,
        rewards_amount: signerRewardsAmount,
      });
    }
  }

  let stackedAmount = 0.0;
  let rewardAmount = 0.0;
  let stackersCount = 0;
  signers.forEach((signer: any) => {
    stackersCount += signer.stackersCount;
    stackedAmount += signer.stackedAmount;
  });
  rewards.forEach((reward: any) => {
    rewardAmount += reward.rewardAmount;
  });

  const resultAggregatedSigners: { [key: string]: number } = {};
  for (const signer of resultSigners) {
    const group =
      signer.name && signer.stacked_amount > 1000000
        ? signer.group
          ? signer.group
          : signer.name
        : "Other";

    resultAggregatedSigners[group] = resultAggregatedSigners[group]
      ? resultAggregatedSigners[group] + signer.stacked_amount
      : signer.stacked_amount;
  }

  return {
    cycle_number: cycleNumber,
    stackers: 0,
    stacked_amount: stackedAmount,
    rewards_amount: rewardAmount,
    signers: resultSigners,
    signers_grouped: Object.keys(resultAggregatedSigners).map((key: string) => {
      return {
        name: key,
        stacked_amount: resultAggregatedSigners[key],
      };
    }),
  };
}

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const currentCycle = await db.getSignersLatestCycle();

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > currentCycle - 6; cycle--) {
    promises.push(getSignersInfoForCycle(cycle));
  }

  const results = await Promise.all(promises);

  res.send(results.reverse());
});

export default router;
