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
      stacked_amount: signerInfo.stackedAmount,
      stackers_count: signerInfo.stackersCount,
      rewards_amount: totalCycleRewards,
    });
  }

  if (signerKeyToPool[signerKey]) {
    res.send({
      signer_key: signerKey,
      name: signerKeyToPool[signerKey].name,
      logo: signerKeyToPool[signerKey].logo,
      website: signerKeyToPool[signerKey].website,
      cycles: results,
    });
  } else {
    res.send({
      signer_key: signerKey,
      cycles: results,
    });
  }
});

export default router;
