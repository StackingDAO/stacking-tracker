import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import { signerKeyToPool } from "../constants";

const router = Router();

router.get("/:signer", async (req: Request, res: Response) => {
  const { signer } = req.params;

  const signerInfo = Object.keys(signerKeyToPool).filter(
    (key: string) => signerKeyToPool[key].slug === signer
  );
  const signerKey = signerInfo.length > 0 ? signerInfo[0] : signer;

  const [signersInfo, stackersInfo, rewardsInfo] = await Promise.all([
    db.getSigner(signerKey),
    db.getStackersForSigner(signerKey),
    db.getStackersRewardsForSigner(signerKey),
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
