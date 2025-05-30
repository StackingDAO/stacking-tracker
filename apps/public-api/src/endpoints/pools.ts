import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import * as stacks from "@repo/stacks";
import { poxAddressToPool } from "../constants";
import { fetchPrice, getPrices } from "../prices";
import {
  getAggregatedPoolsInfo,
  getPoolEntities,
  getPoolsInfoForCycle,
} from "../processors/pools";

async function getInfoForCycle(cycleNumber: number) {
  const [stackers, rewards, prices] = await Promise.all([
    db.getStackersForCycle(cycleNumber, Object.keys(poxAddressToPool)),
    db.getRewardsForCycle(cycleNumber, Object.keys(poxAddressToPool)),
    getPrices(cycleNumber),
  ]);

  return getPoolsInfoForCycle(
    cycleNumber,
    stackers,
    rewards,
    prices.stx,
    prices.btc
  );
}

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const [pox, stxPrice, btcPrice] = await Promise.all([
    stacks.getPox(),
    fetchPrice("STX"),
    fetchPrice("BTC"),
  ]);

  const currentCycle = pox.current_cycle.id;
  const currentCycleProgress =
    1.0 -
    pox.next_cycle.blocks_until_prepare_phase / pox.reward_phase_block_length;
  const currentCycleExtrapolationMult = Math.max(
    1.0 / currentCycleProgress,
    1.0
  );

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > 83; cycle--) {
    promises.push(getInfoForCycle(cycle));
  }

  const results = await Promise.all(promises);

  res.send({
    cycles: getAggregatedPoolsInfo(
      results.slice().reverse(),
      stxPrice,
      btcPrice
    ).map((result) => {
      if (result.cycle_number === currentCycle) {
        return {
          ...result,
          extrapolated_rewards_amount:
            result.rewards_amount * currentCycleExtrapolationMult,
          extrapolated_rewards_amount_usd:
            result.rewards_amount_usd * currentCycleExtrapolationMult,
        };
      }
      return result;
    }),
    entities: getPoolEntities(results.slice(0, 5), stxPrice, btcPrice),
  });
});

export default router;
