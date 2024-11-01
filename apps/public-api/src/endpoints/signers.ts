import { Router, Request, Response } from "express";
import * as db from "@repo/database";
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
  const [currentCycle, stxPrice, btcPrice] = await Promise.all([
    db.getSignersLatestCycle(),
    fetchPrice("STX"),
    fetchPrice("BTC"),
  ]);

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > currentCycle - 6; cycle--) {
    promises.push(getInfoForCycle(cycle));
  }

  const results = await Promise.all(promises);

  const [signers, rewards] = await Promise.all([
    db.getSignersForCycle(currentCycle),
    db.getStackersRewardsForCycle(currentCycle),
  ]);

  res.send({
    cycles: results.slice().reverse(),
    entities: getSignerEntities(signers, rewards, stxPrice, btcPrice),
  });
});

export default router;
