import { Router, Request, Response } from "express";
import * as db from "@repo/database";
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
  const [currentCycle, stxPrice, btcPrice] = await Promise.all([
    db.getSignersLatestCycle(),
    fetchPrice("STX"),
    fetchPrice("BTC"),
  ]);

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
    ),
    entities: getPoolEntities(results.slice(0, 5), stxPrice, btcPrice),
  });
});

export default router;
