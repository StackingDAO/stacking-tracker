import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import * as stacks from "@repo/stacks";
import { fetchPrice, getPrices } from "../prices";
import { getTokenEntities, getTokensInfoForCycle } from "../processors/tokens";
import { tokensList } from "../constants";

async function getInfoForCycle(cycleNumber: number) {
  const [stackers, rewards, prices] = await Promise.all([
    db.getStackersForCycle(cycleNumber),
    db.getRewardsForCycle(cycleNumber),
    getPrices(cycleNumber),
  ]);

  return getTokensInfoForCycle(
    cycleNumber,
    stackers,
    rewards,
    prices.stx,
    prices.btc,
    prices.stStxBtcSupply
  );
}

async function getTokensSupply(stxPrice: number) {
  const tokenSupplyPromises = tokensList.map((elem: any) =>
    Promise.all(elem.tokenAddresses.map((tokenAddress: string) =>
      stacks.getTotalSupply(tokenAddress)
    ))
  );
  const [tokensSupplyResults] = await Promise.all([
    Promise.all(tokenSupplyPromises),
  ]);

  const stxPerStStx = await stacks.getStxPerStStx();

  let tokens: any[] = [];
  tokensList.forEach((elem: any, index: number) => {
    const tokenSupplies = tokensSupplyResults[index];
    const totalSupply = tokenSupplies.reduce((sum: number, supply: number) => sum + supply, 0);

    var tokenPrice = 1.0;
    if (elem.name === "stSTX") {
      tokenPrice = stxPerStStx;
    }

    tokens.push({
      token_supply: totalSupply,
      token_mcap: totalSupply * stxPrice * tokenPrice,
    });
  });

  return tokens;
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

  const tokensSupply = await getTokensSupply(stxPrice);
  const tokensEntities = getTokenEntities(
    results.slice(0, 5),
    stxPrice,
    btcPrice
  );
  const entities = tokensEntities.map((item: any, index: number) => {
    return { ...item, ...tokensSupply[index] };
  });

  res.send({
    cycles: results.slice().reverse(),
    entities: entities,
  });
});

export default router;
