import { Table } from "../components/Table";
import * as api from "../common/public-api";
import { currency, shortAddress } from "@/app/common/utils";

export default async function Home() {
  const minersInfo = await api.get("/miners");

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
      </div>

      <Table
        columnTitles={[
          "Address",
          "Blocks mined",
          "Blocks participated",
          "Rewards",
          "Fees",
          "Avg fees",
          "Total bids",
          "Avg bid",
        ]}
        rows={minersInfo.map((miner: any) => [
          shortAddress(miner.address),
          miner.blocks_mined,
          miner.blocks_participated,
          `${miner.rewards} STX`,
          `${currency.short.format(miner.fees)} STX`,
          `${currency.short.format(miner.fees / miner.blocks_mined)} STX`,
          `${currency.long.format(miner.bids)} BTC`,
          `${currency.long.format(miner.bids / miner.blocks_participated)} BTC`,
        ])}
      />
    </main>
  );
}
