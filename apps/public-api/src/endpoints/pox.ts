import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import { poxAddressToPool } from "../constants";
import * as stacksPox from "@repo/stacks/src/pox";
import { fetchPrice } from "../prices";

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
  const [stxPrice, btcPrice, pox, currentCycle] = await Promise.all([
    fetchPrice("STX"),
    fetchPrice("BTC"),
    stacksPox.getPox(),
    db.getSignersLatestCycle(),
  ]);

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > 83; cycle--) {
    promises.push(getInfoForCycle(cycle));
  }

  const results = await Promise.all(promises);
  res.send({
    prices: {
      stx: stxPrice,
      btc: btcPrice,
    },

    current_burn_block: pox.current_burnchain_block_height,
    next_cycle_prepare_start_block:
      pox.next_cycle.prepare_phase_start_block_height,
    next_cycle_reward_start_block:
      pox.next_cycle.reward_phase_start_block_height,

    details: {
      total_liquid_supply_ustx: pox.total_liquid_supply_ustx,
      next_cycle_min_threshold_ustx: pox.next_cycle.min_threshold_ustx,
      prepare_phase_block_length: pox.prepare_phase_block_length,
      reward_phase_block_length: pox.reward_phase_block_length,
    },

    cycles: results.reverse(),
  });
});

export default router;
