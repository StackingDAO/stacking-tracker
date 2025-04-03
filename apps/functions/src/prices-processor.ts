import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { getPriceLatestCycle, savePrice } from "@repo/database";
import { getCurrentCycle } from "@repo/stacks";
import type { Context, ScheduledEvent } from "aws-lambda";
import * as stacks from "@repo/stacks";

async function cycleEndBlock(cycle: number): Promise<number> {
  const pox = await stacks.getPox();

  const currentCycle = pox.current_cycle.id;
  const currentCycleEnd = pox.next_cycle.reward_phase_start_block_height;

  const cyclesAgo = currentCycle - cycle;
  const cycleEnd = currentCycleEnd - 2100 * cyclesAgo;
  return cycleEnd;
}

async function blockToDate(block: number): Promise<Date> {
  const url = `https://api.blockchair.com/bitcoin/blocks?q=id(${block})`;
  const result = await fetch(url).then((res) => res.json());
  const blockTime = result["data"][0]["time"];
  return new Date(blockTime);
}

async function priceAtDate(symbol: string, date: Date): Promise<number> {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const symbols = {
    btc: "bitcoin",
    stx: "blockstack",
  };

  const url = `https://pro-api.coingecko.com/api/v3/coins/${symbols[symbol]}/history?date=${formattedDate}&x_cg_pro_api_key=${process.env.COINGECKO_API_KEY}`;
  const result = await fetch(url).then((res) => res.json());
  const price = result["market_data"]["current_price"]["usd"];
  return price;
}

async function savePrices(cycle: number) {
  const endBlock = await cycleEndBlock(cycle);
  const endDate = await blockToDate(endBlock);

  for (const symbol of ["btc", "stx"]) {
    const price = await priceAtDate(symbol, endDate);
    await savePrice(cycle, symbol, price);
    console.log("Saved price", price, "for", symbol, "in cycle", cycle);
  }
}

async function saveSupply(cycle: number) {
  const endBlock = await cycleEndBlock(cycle);
  const stacksBlock = await stacks.getBlockByBurnHeight(endBlock - 2100);
  const stStxBtcSupply = await stacks.getStStxBtcSupplyAtBlock(
    stacksBlock.results[0].height - 1
  );
  await savePrice(cycle, "ststxbtc_supply", stStxBtcSupply);
  console.log("Saved supply", stStxBtcSupply, "for stSTXbtc in cycle", cycle);
}

export async function processCyclePrices(
  _: ScheduledEvent,
  __: Context
): Promise<void> {
  const [
    currentCycle,
    latestCycleBtc,
    latestCycleStx,
    latestCycleStStxBtcSupply,
  ] = await Promise.all([
    getCurrentCycle(),
    getPriceLatestCycle("btc"),
    getPriceLatestCycle("stx"),
    getPriceLatestCycle("ststxbtc_supply"),
  ]);

  const latestCycle = Math.min(
    latestCycleBtc,
    latestCycleStx,
    latestCycleStStxBtcSupply
  );

  const cycleToProcess = Math.max(latestCycle, 83) + 1;
  console.log(
    "Processing cycle",
    cycleToProcess,
    ", current cycle",
    currentCycle
  );

  if (currentCycle > cycleToProcess) {
    await savePrices(cycleToProcess);
  }
  if (currentCycle >= cycleToProcess) {
    await saveSupply(cycleToProcess);
  }
}
