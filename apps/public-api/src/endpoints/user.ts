import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import { poxAddressToPool } from "../constants";
import * as stacksAccounts from "@repo/stacks/src/accounts";
import { fetchPrice } from "../prices";

const router = Router();
console.log("ENV", process.env.STACKS_API);

router.get("/:wallet", async (req: Request, res: Response) => {
  const { wallet } = req.params;

  const [stxPrice, btcPrice, balances] = await Promise.all([
    fetchPrice("STX"),
    fetchPrice("BTC"),
    stacksAccounts.getBalances(wallet),
  ]);

  res.send({
    prices: {
      stx: stxPrice,
      btc: btcPrice,
    },
    balances: balances,
  });
});

export default router;
