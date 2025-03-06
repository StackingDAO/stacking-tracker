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

export async function processCyclePrices(
  _: ScheduledEvent,
  __: Context
): Promise<void> {
  const [currentCycle, latestCycleBtc, latestCycleStx] = await Promise.all([
    getCurrentCycle(),
    getPriceLatestCycle("btc"),
    getPriceLatestCycle("stx"),
  ]);
  const latestCycle = Math.min(latestCycleBtc, latestCycleStx);

  const cycleToProcess = Math.max(latestCycle, 83) + 1;
  if (currentCycle <= cycleToProcess) {
    return;
  }

  console.log(
    "Processing cycle",
    cycleToProcess,
    ", current cycle",
    currentCycle
  );
  const endBlock = await cycleEndBlock(cycleToProcess);
  const endDate = await blockToDate(endBlock);

  for (const symbol of ["btc", "stx"]) {
    const price = await priceAtDate(symbol, endDate);
    await savePrice(cycleToProcess, symbol, price);
    console.log(
      "Saved price",
      price,
      "for",
      symbol,
      "in cycle",
      cycleToProcess
    );
  }
}
