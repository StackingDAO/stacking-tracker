import * as stacks from "@repo/stacks";

const cacheBlocks: { [block: number]: number } = {};
const priceCache: { [key: string]: number } = {};

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export const fetchPrice = async (symbol: string): Promise<number> => {
  try {
    const url = `https://api.exchange.coinbase.com/products/${symbol}-USD/ticker`;
    const result = await fetch(url).then((res) => res.json());
    return result.bid;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};

const fetchBurnBlockTime = async (block: number): Promise<number> => {
  try {
    if (cacheBlocks[block]) {
      return cacheBlocks[block];
    }

    const url = `https://api.blockchair.com/bitcoin/blocks?q=id(${block})`;
    const result = await fetch(url).then((res) => res.json());
    const blockTime = result["data"][0]["time"];

    cacheBlocks[block] = blockTime;

    return blockTime;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};

const fetchPriceHistory = async (
  symbol: string,
  date: Date
): Promise<number> => {
  try {
    const formattedDate = formatDate(date);
    const cacheKey = `${symbol}:${formattedDate}`;

    if (priceCache[cacheKey]) {
      return priceCache[cacheKey];
    }

    const url = `https://pro-api.coingecko.com/api/v3/coins/${symbol}/history?date=${formattedDate}&x_cg_pro_api_key=${process.env.COINGECKO_API_KEY}`;
    const result = await fetch(url).then((res) => res.json());
    const price = result["market_data"]["current_price"]["usd"];

    priceCache[cacheKey] = price;

    return price;
  } catch (error) {
    // console.log("error", error);
    return 0;
  }
};

const fetchPriceHistoryBlock = async (
  symbol: string,
  block: number
): Promise<number> => {
  try {
    const blockTime = await fetchBurnBlockTime(block);
    return await fetchPriceHistory(symbol, new Date(blockTime));
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};

export const fetchCyclePrice = async (
  symbol: string,
  cycle: number
): Promise<any> => {
  try {
    const pox = await stacks.getPox();

    const currentCycle = pox.current_cycle.id;

    const cyclesAgo = currentCycle - cycle;
    const cycleEnd =
      pox.next_cycle.reward_phase_start_block_height - 2100 * cyclesAgo;

    const result = await fetchPriceHistoryBlock(
      symbol === "BTC" ? "bitcoin" : "blockstack",
      Math.min(pox.current_burnchain_block_height, cycleEnd)
    );
    return result;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};

// TODO: add cache
export const fetchCyclesPrices = async (firstCycle: number): Promise<any> => {
  try {
    const pox = await stacks.getPox();

    const currentCycle = pox.current_cycle.id;
    const promisesPricesBtc: any[] = [];
    const promisesPricesStx: any[] = [];

    for (let cycle = currentCycle; cycle >= firstCycle; cycle--) {
      const cyclesAgo = currentCycle - cycle;
      const cycleEnd =
        pox.next_cycle.reward_phase_start_block_height - 2100 * cyclesAgo;

      promisesPricesBtc.push(
        fetchPriceHistoryBlock(
          "bitcoin",
          Math.min(pox.current_burnchain_block_height, cycleEnd)
        )
      );
      promisesPricesStx.push(
        fetchPriceHistoryBlock(
          "blockstack",
          Math.min(pox.current_burnchain_block_height, cycleEnd)
        )
      );
    }
    const [pricesBtc, pricesStx] = await Promise.all([
      Promise.all(promisesPricesBtc),
      Promise.all(promisesPricesStx),
    ]);

    let result = {};
    for (let cycle = currentCycle; cycle > 83; cycle--) {
      const priceIndex = currentCycle - cycle;
      result[cycle] = {
        stx: pricesStx[priceIndex],
        btc: pricesBtc[priceIndex],
      };
    }
    return result;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};

// TODO: add cache
export const fetchCycleStStxBtcSupply = async (
  firstCycle: number
): Promise<any> => {
  try {
    const pox = await stacks.getPox();

    const currentCycle = pox.current_cycle.id;

    const cyclesAgo = currentCycle - firstCycle;
    const cycleEnd =
      pox.next_cycle.reward_phase_start_block_height - 2100 * cyclesAgo;
    const cycleRewardEnd = cycleEnd - 200; // stackingdao withdraw window

    let blockInfo = await stacks.getBlockByBurnHeight(
      Math.min(cycleRewardEnd, pox.current_burnchain_block_height - 1)
    );

    if (!blockInfo || blockInfo.results.length === 0) {
      blockInfo = await stacks.getBlockByBurnHeight(
        Math.min(cycleRewardEnd, pox.current_burnchain_block_height - 1) - 1
      );
    }

    const result = await stacks.getStStxBtcSupplyAtBlock(
      blockInfo.results[0].height - 1
    );

    return result;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};

// TODO: add cache
export const fetchCyclesStStxBtcSupply = async (
  firstCycle: number
): Promise<any> => {
  try {
    const pox = await stacks.getPox();

    const currentCycle = pox.current_cycle.id;
    const promises: any[] = [];

    for (let cycle = currentCycle; cycle >= firstCycle; cycle--) {
      const cyclesAgo = currentCycle - cycle;
      const cycleEnd =
        pox.next_cycle.reward_phase_start_block_height - 2100 * cyclesAgo;
      const cycleRewardEnd = cycleEnd - 200; // stackingdao withdraw window

      let blockInfo = await stacks.getBlockByBurnHeight(
        Math.min(cycleRewardEnd, pox.current_burnchain_block_height - 1)
      );

      if (!blockInfo || blockInfo.results.length === 0) {
        blockInfo = await stacks.getBlockByBurnHeight(
          Math.min(cycleRewardEnd, pox.current_burnchain_block_height - 1) - 1
        );
      }
      promises.push(
        stacks.getStStxBtcSupplyAtBlock(blockInfo.results[0].height)
      );
    }
    const supplies = await Promise.all(promises);

    let result = {};
    for (let cycle = currentCycle; cycle > 83; cycle--) {
      const supplyIndex = currentCycle - cycle;
      result[cycle] = {
        supply: supplies[supplyIndex] ?? 0,
      };
    }
    return result;
  } catch (error) {
    console.log("error", error);
    return 0;
  }
};
