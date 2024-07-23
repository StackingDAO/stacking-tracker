import { Table } from "../components/Table";
import * as api from "../common/public-api";
import { currency, shortAddress } from "@/app/common/utils";

const fetchPrice = async (symbol: string) => {
  const url = `https://api.exchange.coinbase.com/products/${symbol}-USD/ticker`;
  const response = await fetch(url, { credentials: "omit" });
  const data = await response.json();
  return data.bid;
};

export default async function Home() {
  const minersInfo = await api.get("/miners");
  const priceBtc = await fetchPrice("BTC");
  const priceStx = await fetchPrice("STX");

  return (
    <main className="flex flex-col justify-between w-full max-w-5xl pt-12">
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30">
        <div className="group rounded-lg border border-transparent px-5 py-4 ">
          <h2 className="mb-3 text-2xl font-semibold">
            {minersInfo.length} Active Miners
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            In last 144 blocks
          </p>
        </div>
        <div className="group rounded-lg border border-transparent px-5 py-4 ">
          <h2 className="mb-3 text-2xl font-semibold">${priceBtc}</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">BTC Price</p>
        </div>
        <div className="group rounded-lg border border-transparent px-5 py-4 ">
          <h2 className="mb-3 text-2xl font-semibold">${priceStx}</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">STX Price</p>
        </div>
      </div>

      <Table
        columnTitles={[
          "Address",
          "Mined/Bids",
          "Rewards",
          "Fees",
          "Avg fees",
          "Total bids",
          "Avg bid",
          "Profit",
        ]}
        rows={minersInfo.map((miner: any) => [
          shortAddress(miner.address),
          `${miner.blocks_mined}/${miner.blocks_participated} (${currency.short.format((miner.blocks_mined / miner.blocks_participated) * 100)}%)`,
          `${miner.rewards} STX ($${currency.short.format(miner.rewards * priceStx)})`,
          `${currency.short.format(miner.fees)} STX ($${currency.short.format(miner.fees * priceStx)})`,
          `${currency.short.format(miner.fees / miner.blocks_mined)} STX ($${currency.short.format((miner.fees / miner.blocks_mined) * priceStx)})`,
          `${currency.long.format(miner.bids)} BTC ($${currency.short.format(miner.bids * priceBtc)})`,
          `${currency.long.format(miner.bids / miner.blocks_participated)} BTC ($${currency.short.format((miner.bids / miner.blocks_participated) * priceBtc)})`,
          `$${currency.short.format((miner.rewards + miner.fees) * priceStx - miner.bids * priceBtc)}`,
        ])}
      />
    </main>
  );
}
