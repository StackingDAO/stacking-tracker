import { Router, Request, Response } from "express";
import * as db from "@repo/database";

const router = Router();

router

  .get("/", async (req: Request, res: Response) => {
    const [signers, rewards] = await Promise.all([
      db.getSigners(),
      db.getStackersRewards(),
    ]);

    const cycleInfo: { [key: number]: any } = {};
    for (const signer of signers) {
      const rewardsAmount =
        rewards.filter(
          (rewardInfo: { signerKey: string; cycleNumber: number }) =>
            rewardInfo.signerKey === signer.signerKey &&
            rewardInfo.cycleNumber === signer.cycleNumber
        )[0]?.rewardAmount ?? 0;

      if (cycleInfo[signer.cycleNumber]) {
        cycleInfo[signer.cycleNumber].signers.push({
          signer_key: signer.signerKey,
          stackers_count: signer.stackersCount,
          stacked_amount: signer.stackedAmount,
          rewards_amount: rewardsAmount,
        });
        cycleInfo[signer.cycleNumber].stackers += signer.stackersCount;
        cycleInfo[signer.cycleNumber].stackedAmount += signer.stackedAmount;
        cycleInfo[signer.cycleNumber].rewardsAmount += rewardsAmount;
      } else {
        cycleInfo[signer.cycleNumber] = {
          signers: [
            {
              signer_key: signer.signerKey,
              stackers_count: signer.stackersCount,
              stacked_amount: signer.stackedAmount,
              rewards_amount: rewardsAmount,
            },
          ],
          stackers: signer.stackersCount,
          stackedAmount: signer.stackedAmount,
          rewardsAmount: rewardsAmount,
        };
      }
    }

    const result = Object.keys(cycleInfo).map((cycle) => {
      return {
        cycle_number: cycle,
        signers: cycleInfo[cycle].signers,
        stackers_count: cycleInfo[cycle].stackersCount,
        stacked_amount: cycleInfo[cycle].stackedAmount,
        rewards_amount: cycleInfo[cycle].rewardsAmount,
      };
    });

    res.send(result.reverse());
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
