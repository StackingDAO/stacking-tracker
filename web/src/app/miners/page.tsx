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
      <div className="mb-12 bg-white rounded-lg">
        <div className="mb-32 grid text-center rounded-lg lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30">
          <div className="group rounded-lg border border-transparent px-5 py-4 ">
            <h2 className="mb-3 text-xl font-semibold">${priceBtc}</h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">BTC Price</p>
          </div>
          <div className="group rounded-lg border border-transparent px-5 py-4 ">
            <h2 className="mb-3 text-xl font-semibold">${priceStx}</h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">STX Price</p>
          </div>
        </div>
      </div>

      <div className="mb-12 bg-white rounded-lg">
        <div className="mb-32 grid text-center rounded-lg lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30">
          <div className="group rounded-lg border border-transparent px-5 py-4 ">
            <h2 className="mb-3 text-xl font-semibold">Last 144 Blocks</h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              {minersInfo.length} Active Miners
            </p>
          </div>
          <div className="group rounded-lg border border-transparent px-5 py-4 ">
            <h2 className="mb-3 text-xl font-semibold">
              {currency.short.format(
                minersInfo
                  .map((miner: any) => miner.rewards + miner.fees)
                  .reduce((acc: number, current: number) => acc + current, 0)
              )}{" "}
              STX
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Total Rewards $
              {currency.short.format(
                minersInfo
                  .map((miner: any) => miner.rewards + miner.fees)
                  .reduce((acc: number, current: number) => acc + current, 0) *
                  priceStx
              )}
            </p>
          </div>
          <div className="group rounded-lg border border-transparent px-5 py-4 ">
            <h2 className="mb-3 text-xl font-semibold">
              {currency.short.format(
                minersInfo
                  .map((miner: any) => miner.bids)
                  .reduce((acc: number, current: number) => acc + current, 0)
              )}{" "}
              BTC
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Total Bids $
              {currency.short.format(
                minersInfo
                  .map((miner: any) => miner.bids)
                  .reduce((acc: number, current: number) => acc + current, 0) *
                  priceBtc
              )}
            </p>
          </div>
          <div className="group rounded-lg border border-transparent px-5 py-4 ">
            <h2 className="mb-3 text-xl font-semibold">
              $
              {currency.short.format(
                minersInfo
                  .map((miner: any) => miner.rewards + miner.fees)
                  .reduce((acc: number, current: number) => acc + current, 0) *
                  priceStx -
                  minersInfo
                    .map((miner: any) => miner.bids)
                    .reduce(
                      (acc: number, current: number) => acc + current,
                      0
                    ) *
                    priceBtc
              )}
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">Total Profit</p>
          </div>
        </div>

        <Table
          columnHeaders={[
            { title: "Address" },
            { title: "Mined/Bids" },
            { title: "Rewards" },
            { title: "Fees" },
            { title: "Avg Fees" },
            { title: "Total Bids" },
            { title: "Avg Bid" },
            { title: "Total Bid Fees" },
            { title: "Avg Bid Fees" },
            { title: "Profit" },
          ]}
          rows={minersInfo.map((miner: any) => [
            shortAddress(miner.address),
            <div key={miner.address + "-blocks"} className="flex flex-col">
              <p>
                {miner.blocks_mined}/{miner.blocks_participated}
              </p>
              <p className="text-xs text-gray-400">
                {currency.short.format(
                  (miner.blocks_mined / miner.blocks_participated) * 100
                )}
                %
              </p>
            </div>,
            <div key={miner.address + "-rewards"} className="flex flex-col">
              <p>{miner.rewards} STX</p>
              <p className="text-xs text-gray-400">
                ${currency.short.format(miner.rewards * priceStx)}
              </p>
            </div>,
            <div key={miner.address + "-fees"} className="flex flex-col">
              <p>{currency.short.format(miner.fees)} STX</p>
              <p className="text-xs text-gray-400">
                ${currency.short.format(miner.fees * priceStx)}
              </p>
            </div>,
            <div key={miner.address + "-avgfees"} className="flex flex-col">
              <p>
                {currency.short.format(miner.fees / miner.blocks_mined)} STX
              </p>
              <p className="text-xs text-gray-400">
                $
                {currency.short.format(
                  (miner.fees / miner.blocks_mined) * priceStx
                )}
              </p>
            </div>,
            <div key={miner.address + "-bids"} className="flex flex-col">
              <p>{currency.long.format(miner.bids)} BTC</p>
              <p className="text-xs text-gray-400">
                ${currency.short.format(miner.bids * priceBtc)}
              </p>
            </div>,
            <div key={miner.address + "-avgbids"} className="flex flex-col">
              <p>
                {currency.long.format(miner.bids / miner.blocks_participated)}{" "}
                BTC
              </p>
              <p className="text-xs text-gray-400">
                $
                {currency.short.format(
                  (miner.bids / miner.blocks_participated) * priceBtc
                )}
              </p>
            </div>,
            <div key={miner.address + "-bidfees"} className="flex flex-col">
              <p>{currency.long.format(miner.bids_fees)} BTC</p>
              <p className="text-xs text-gray-400">
                ${currency.short.format(miner.bids_fees * priceBtc)}
              </p>
            </div>,
            <div key={miner.address + "-avgbids"} className="flex flex-col">
              <p>
                {currency.long.format(
                  miner.bids_fees / miner.blocks_participated
                )}{" "}
                BTC
              </p>
              <p className="text-xs text-gray-400">
                $
                {currency.short.format(
                  (miner.bids_fees / miner.blocks_participated) * priceBtc
                )}
              </p>
            </div>,
            `$${currency.short.format((miner.rewards + miner.fees) * priceStx - (miner.bids + miner.bids_fees) * priceBtc)}`,
          ])}
        />
      </div>
    </main>
  );
}
