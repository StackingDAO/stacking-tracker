import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import * as stacks from "@repo/stacks";
import { signerKeyToPool } from "../constants";
import { getPrices } from "../prices";

export const fetchCyclesPrices = async (firstCycle: number): Promise<any> => {
  try {
    const pox = await stacks.getPox();

    const currentCycle = pox.current_cycle.id;
    const promises: any[] = [];

    for (let cycle = currentCycle; cycle >= firstCycle; cycle--) {
      promises.push(getPrices(cycle));
    }
    const results = await Promise.all(promises);

    let result = {};
    for (let cycle = currentCycle; cycle >= firstCycle; cycle--) {
      const priceIndex = currentCycle - cycle;
      result[cycle] = {
        stx: results[priceIndex].stx,
        btc: results[priceIndex].btc,
      };
    }

    return result;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};

const router = Router();

router.get("/:signer", async (req: Request, res: Response) => {
  const { signer } = req.params;

  const signerInfo = Object.keys(signerKeyToPool).filter(
    (key: string) => signerKeyToPool[key].slug === signer
  );
  const signerKey = signerInfo.length > 0 ? signerInfo[0] : signer;

  const [signersInfo, rewardsInfo, prices] = await Promise.all([
    db.getSigner(signerKey),
    db.getStackersRewardsForSigner(signerKey),
    fetchCyclesPrices(84),
  ]);

  const results = [];
  for (const signerInfo of signersInfo) {
    const cycleRewards = rewardsInfo.filter(
      (rewardInfo: { cycleNumber: number }) =>
        rewardInfo.cycleNumber === signerInfo.cycleNumber
    );

    const totalCycleRewards = cycleRewards
      .map((reward: any) => reward.rewardAmount)
      .reduce((acc: number, current: number) => acc + current, 0);

    const previousStackedValue =
      signerInfo.stackedAmount * prices[signerInfo.cycleNumber].stx;
    const previousRewardsValue =
      totalCycleRewards * prices[signerInfo.cycleNumber].btc;
    // 26 cycles per year
    const apr = (previousRewardsValue / previousStackedValue) * 26;
    const apy = (Math.pow(1 + apr / 26, 26) - 1) * 100.0;

    results.push({
      cycle_number: signerInfo.cycleNumber,
      stacked_amount: signerInfo.stackedAmount,
      stackers_count: signerInfo.stackersCount,
      rewards_amount: totalCycleRewards,
      apy: apy,
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
