import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import * as stacks from "@repo/stacks";
import { poolSlugToPool } from "../constants";
import { getPrices } from "../prices";

async function getPoolsInfoForCycle(
  cycleNumber: number,
  poxAddresses: string[],
  fee: number,
) {
  const [stackers, rewards, prices] = await Promise.all([
    db.getStackersForCycle(cycleNumber, poxAddresses),
    db.getRewardsForCycle(cycleNumber),
    getPrices(cycleNumber),
  ]);

  let stackedAmount = 0.0;
  let rewardAmount = 0.0;
  let stackersCount = 0;
  for (const poxAddress of poxAddresses) {
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
  }

  const rewardFeeMult = 1 - fee;
  const previousStackedValue = stackedAmount * prices.stx;
  const previousRewardsValue = rewardAmount * rewardFeeMult * prices.btc;
  // 26 cycles per year
  const apr =
    previousStackedValue > 0 && Number.isFinite(previousStackedValue)
      ? (previousRewardsValue / previousStackedValue) * 26
      : 0;
  const rawApy = (Math.pow(1 + apr / 26, 26) - 1) * 100.0;
  const apy = Number.isFinite(rawApy) ? rawApy : 0;

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
  const pool = poolSlugToPool[slug];
  if (!pool) {
    res.status(404).send({ error: "Pool not found" });
    return;
  }

  const pox = await stacks.getPox();

  const currentCycle = pox.current_cycle.id;
  const currentCycleProgress =
    1.0 -
    pox.next_cycle.blocks_until_prepare_phase / pox.reward_phase_block_length;
  const currentCycleExtrapolationMult = Math.max(
    1.0 / currentCycleProgress,
    1.0
  );

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle >= 84; cycle--) {
    promises.push(getPoolsInfoForCycle(cycle, pool.poxAddresses, pool.fee));
  }

  const results = await Promise.all(promises);
  res.send({
    name: pool.name,
    logo: pool.logo,
    website: pool.website,
    fee: pool.fee,
    feeDisclosed: pool.feeDisclosed,
    cycles: results.reverse().map((result) => {
      if (result.cycle_number === currentCycle) {
        return {
          ...result,
          extrapolated_rewards_amount:
            result.rewards_amount * currentCycleExtrapolationMult,
          extrapolated_apy: result.apy * currentCycleExtrapolationMult,
        };
      }
      return result;
    }),
  });
});

export default router;
