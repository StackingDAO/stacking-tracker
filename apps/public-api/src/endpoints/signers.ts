import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import * as stacks from "@repo/stacks";
import { fetchPrice } from "../prices";
import {
  getSignerEntities,
  getSignersInfoForCycle,
} from "../processors/signers";

async function getInfoForCycle(cycleNumber: number) {
  const [signers, rewards, stxPrice, btcPrice] = await Promise.all([
    db.getSignersForCycle(cycleNumber),
    db.getStackersRewardsForCycle(cycleNumber),
    fetchPrice("STX"),
    fetchPrice("BTC"),
  ]);

  return getSignersInfoForCycle(
    cycleNumber,
    signers,
    rewards,
    stxPrice,
    btcPrice
  );
}

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const [pox, lastCycle, stxPrice, btcPrice] = await Promise.all([
    stacks.getPox(),
    db.getSignersLatestCycle(),
    fetchPrice("STX"),
    fetchPrice("BTC"),
  ]);

  const currentCycle = pox.current_cycle.id;
  const currentCycleProgress =
    1.0 -
    pox.next_cycle.blocks_until_prepare_phase / pox.reward_phase_block_length;
  const currentCycleExtrapolationMult = 1.0 / currentCycleProgress;

  const promises: any[] = [];
  for (let cycle = lastCycle; cycle > 83; cycle--) {
    promises.push(getInfoForCycle(cycle));
  }

  const results = await Promise.all(promises);

  const [signers, rewards] = await Promise.all([
    db.getSignersForCycle(lastCycle),
    db.getStackersRewardsForCycle(lastCycle),
  ]);

  res.send({
    cycles: results
      .slice()
      .reverse()
      .map((result) => {
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
    entities: getSignerEntities(signers, rewards, stxPrice, btcPrice),
  });
});

export default router;
