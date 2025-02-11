import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import * as stacks from "@repo/stacks";
import { fetchCyclesPrices } from "../prices";
import { getPoxInfoForCycle } from "../processors/pox";

async function getInfoForCycle(
  cycleNumber: number,
  stxPrice: number,
  btcPrice: number
) {
  const [signers, stackers, rewards] = await Promise.all([
    db.getSignersForCycle(cycleNumber),
    db.getStackersForCycle(cycleNumber),
    db.getRewardsForCycle(cycleNumber),
  ]);

  const info: any = getPoxInfoForCycle(
    cycleNumber,
    stackers,
    rewards,
    stxPrice,
    btcPrice
  );
  info.signers_count = signers.length;

  // 26 cycles per year
  const apr =
    ((info.rewards_amount * btcPrice) / (info.stacked_amount * stxPrice)) * 26;
  info.apy = (Math.pow(1 + apr / 26, 26) - 1) * 100.0;

  return info;
}

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const [prices, pox, currentCycle] = await Promise.all([
    fetchCyclesPrices(84),
    stacks.getPox(),
    db.getSignersLatestCycle(),
  ]);

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > 83; cycle--) {
    promises.push(getInfoForCycle(cycle, prices[cycle].stx, prices[cycle].btc));
  }
  const results = await Promise.all(promises);

  const nextCycleStartBlock = pox.next_cycle.reward_phase_start_block_height;
  const currentBlock = pox.current_burnchain_block_height;
  const cycleLength =
    pox.prepare_phase_block_length + pox.reward_phase_block_length;

  res.send({
    current_cycle: {
      cycle_number: results[0].cycle_number,
      stacked_amount: results[0].stacked_amount,
      rewards_amount: results[0].rewards_amount,
      stacked_amount_usd: results[0].stacked_amount * prices[currentCycle].stx,
      rewards_amount_usd: results[0].rewards_amount * prices[currentCycle].btc,
      started_days_ago:
        (currentBlock - (nextCycleStartBlock - cycleLength)) / 144,
      ends_in_days: (nextCycleStartBlock - currentBlock) / 144,
    },
    next_cycle: {
      cycle_number: results[0].cycle_number + 1,
      prepare_phase_start_block:
        pox.next_cycle.prepare_phase_start_block_height,
      reward_phase_start_block: nextCycleStartBlock,
      starts_in_days: (nextCycleStartBlock - currentBlock) / 144,
    },

    details: {
      total_liquid_supply_stx: pox.total_liquid_supply_ustx / 1000000.0,
      next_cycle_min_threshold_stx:
        pox.next_cycle.min_threshold_ustx / 1000000.0,
      prepare_phase_block_length: pox.prepare_phase_block_length,
      reward_phase_block_length: pox.reward_phase_block_length,
    },

    cycles: results.reverse(),
  });
});

export default router;
