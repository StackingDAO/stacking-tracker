import { Table } from "../components/Table";
import * as api from "../common/public-api";
import { currency, shortAddress } from "@/app/common/utils";

export default async function Home() {
  const poolsInfo = await api.get("/pools");

  return (
    <main className="flex flex-col justify-between w-full max-w-5xl pt-12">
      {poolsInfo.map((cycleInfo: any) => (
        <div
          key={cycleInfo.cycle_number}
          className="pb-4 mb-12 bg-white rounded-lg"
        >
          <div className="mb-32 grid text-center rounded-lg lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30">
            <div className="group rounded-lg border border-transparent px-5 py-4 ">
              <h2 className="mb-3 text-xl font-semibold">
                #{cycleInfo.cycle_number}
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">Cycle</p>
            </div>

            <div className="group rounded-lg border border-transparent px-5 py-4">
              <h2 className="mb-3 text-xl font-semibold">
                {cycleInfo.pools.length}
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">Pools</p>
            </div>

            <div className="group rounded-lg border border-transparent px-5 py-4">
              <h2 className="mb-3 text-xl font-semibold">
                {currency.short.format(cycleInfo.stacked_amount)} STX
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">Stacked</p>
            </div>
            <div className="group rounded-lg border border-transparent px-5 py-4">
              <h2 className="mb-3 text-xl font-semibold">
                {currency.short.format(cycleInfo.rewards_amount)} BTC
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">Rewards</p>
            </div>
          </div>

          <Table
            columnTitles={[
              "Name",
              "PoX Address",
              "Stackers",
              "Stacked",
              "Rewards",
            ]}
            rows={cycleInfo.pools.map((pool: any) => [
              pool.name,
              shortAddress(pool.pox_address),
              pool.stackers_count,
              `${currency.short.format(pool.stacked_amount)} STX`,
              `${currency.short.format(pool.rewards_amount)} BTC`,
            ])}
          />
        </div>
      ))}
    </main>
  );
}
