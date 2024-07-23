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
        blocksMined: 0,
        blocksParticipated: 0,
        rewardAmount: 0,
        feesAmount: 0,
        bidAmount: 0,
      };
    }

    aggregatedInfo[miner.bitcoinAddress].blocksMined += 1;
    aggregatedInfo[miner.bitcoinAddress].rewardAmount += miner.rewardAmount;
    aggregatedInfo[miner.bitcoinAddress].feesAmount += miner.feesAmount;
  }

  for (const bid of bids) {
    if (!aggregatedInfo[bid.bitcoinAddress]) {
      aggregatedInfo[bid.bitcoinAddress] = {
        blocksMined: 0,
        blocksParticipated: 0,
        rewardAmount: 0,
        feesAmount: 0,
        bidAmount: 0,
      };
    }
    aggregatedInfo[bid.bitcoinAddress].bidAmount += bid.bidAmount;
    aggregatedInfo[bid.bitcoinAddress].blocksParticipated += 1;
  }

  const result: any[] = [];
  for (const minerAddress of Object.keys(aggregatedInfo)) {
    result.push({
      address: minerAddress,
      blocks_mined: aggregatedInfo[minerAddress].blocksMined,
      blocks_participated: aggregatedInfo[minerAddress].blocksParticipated,
      rewards: aggregatedInfo[minerAddress].rewardAmount,
      fees: aggregatedInfo[minerAddress].feesAmount,
      bids: aggregatedInfo[minerAddress].bidAmount,
    });
  }

  result.sort((a, b) => b.blocks_mined - a.blocks_mined);
  res.send(result);
});

export default router;
