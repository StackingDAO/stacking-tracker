import * as stacks from "@repo/stacks";
import * as db from "@repo/database";

export const getPrices = async (cycleNumber: number): Promise<any> => {
  const savedPrices = await db.getPrices(cycleNumber);
  if (savedPrices.length < 2) {
    const [btcPrice, stxPrice] = await Promise.all([
      fetchPrice("BTC"),
      fetchPrice("STX"),
    ]);

    return {
      btc: btcPrice,
      stx: stxPrice,
    };
  }
  return {
    btc: savedPrices.filter((price) => price.symbol === "btc")[0].price,
    stx: savedPrices.filter((price) => price.symbol === "stx")[0].price,
  };
};

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

// TODO: add to lambda
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

// TODO: add to lambda
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
