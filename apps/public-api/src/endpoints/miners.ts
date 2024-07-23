import { Router, Request, Response } from "express";
import * as db from "@repo/database";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const minersLastBlockHeight = await db.getMinersLastBlockHeight();

  const miners = await db.getMiners(
    minersLastBlockHeight - 144,
    minersLastBlockHeight
  );

  const bids = await db.getMinersBids(
    minersLastBlockHeight - 144,
    minersLastBlockHeight
  );

  let aggregatedInfo: { [key: string]: any } = {};
  for (const miner of miners) {
    if (!aggregatedInfo[miner.bitcoinAddress]) {
      aggregatedInfo[miner.bitcoinAddress] = {
        rewardAmount: 0,
        feesAmount: 0,
        bidAmount: 0,
      };
    }

    aggregatedInfo[miner.bitcoinAddress].rewardAmount += miner.rewardAmount;
    aggregatedInfo[miner.bitcoinAddress].feesAmount += miner.feesAmount;
  }

  for (const bid of bids) {
    aggregatedInfo[bid.bitcoinAddress].bidAmount += bid.bidAmount;
  }

  const result: any[] = [];
  for (const minerAddress of Object.keys(aggregatedInfo)) {
    result.push({
      address: minerAddress,
      rewards: aggregatedInfo[minerAddress].rewardAmount,
      fees: aggregatedInfo[minerAddress].feesAmount,
      bids: aggregatedInfo[minerAddress].bidAmount,
    });
  }

  res.send(result);
});

export default router;
