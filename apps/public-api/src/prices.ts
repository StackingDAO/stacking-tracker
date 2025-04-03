import * as stacks from "@repo/stacks";
import * as db from "@repo/database";

export const getPrices = async (cycleNumber: number): Promise<any> => {
  const savedPrices = await db.getPrices(cycleNumber);

  const savedBtc = savedPrices.filter((price) => price.symbol === "btc")[0]
    ?.price;
  const savedStx = savedPrices.filter((price) => price.symbol === "stx")[0]
    ?.price;
  const savedStStxBtcSupply = savedPrices.filter(
    (price) => price.symbol === "ststxbtc_supply"
  )[0]?.price;

  return {
    btc: savedBtc !== undefined ? savedBtc : await fetchPrice("BTC"),
    stx: savedStx !== undefined ? savedStx : await fetchPrice("STX"),
    stStxBtcSupply:
      savedStStxBtcSupply !== undefined
        ? savedStStxBtcSupply
        : await stacks.getStStxBtcSupply(),
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
