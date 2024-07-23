import { Router, Request, Response } from "express";
import * as db from "@repo/database";

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

    resultSigners.push({
      signer_key: signer.signerKey,
      stackers_count: signer.stackersCount,
      stacked_amount: signer.stackedAmount,
      rewards_amount: signerRewardsAmount,
    });
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

  return {
    cycle_number: cycleNumber,
    stackers: 0,
    stacked_amount: stackedAmount,
    rewards_amount: rewardAmount,
    signers: resultSigners,
  };
}

const router = Router();

router

  .get("/", async (req: Request, res: Response) => {
    const currentCycle = await db.getSignersLatestCycle();

    const promises: any[] = [];
    for (let cycle = currentCycle; cycle > currentCycle - 6; cycle--) {
      promises.push(getSignersInfoForCycle(cycle));
    }

    const results = await Promise.all(promises);

    res.send(results);
  })

  .get("/:signer", async (req: Request, res: Response) => {
    const { signer } = req.params;

    const [signersInfo, stackersInfo, rewardsInfo] = await Promise.all([
      db.getSigner(signer),
      db.getStackersForSigner(signer),
      db.getStackersRewardsForSigner(signer),
    ]);

    const results = [];
    for (const signerInfo of signersInfo) {
      const cycleStackers = stackersInfo.filter(
        (stackerInfo: { cycleNumber: number }) =>
          stackerInfo.cycleNumber === signerInfo.cycleNumber
      );
      const cycleRewards = rewardsInfo.filter(
        (rewardInfo: { cycleNumber: number }) =>
          rewardInfo.cycleNumber === signerInfo.cycleNumber
      );

      const totalCycleRewards = cycleRewards
        .map((reward: any) => reward.rewardAmount)
        .reduce((acc: number, current: number) => acc + current, 0);

      results.push({
        cycle_number: signerInfo.cycleNumber,
        signer_key: signerInfo.signerKey,
        stacked_amount: signerInfo.stackedAmount,
        stackers_count: signerInfo.stackersCount,
        stackers: cycleStackers.map((stacker: any) => ({
          address: stacker.stackerAddress,
          stacked_amount: stacker.stackedAmount,
          pox_address: stacker.poxAddress,
          stacker_type: stacker.stackerType,
          rewards_amount: cycleRewards.filter(
            (rewardInfo: { stackerAddress: string }) =>
              rewardInfo.stackerAddress === stacker.stackerAddress
          )[0]?.rewardAmount,
        })),
        rewards_amount: totalCycleRewards,
      });
    }
    res.send(results.reverse());
  });

export default router;
