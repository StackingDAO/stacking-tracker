import { Table } from "../components/Table";
import * as api from "../common/public-api";
import { currency } from "@/app/common/utils";
import ChartBarStacked from "../components/ChartBarStacked";

export default async function Home() {
  const tokensInfo = await api.get("/tokens");

  const lastCycleInfo = tokensInfo[tokensInfo.length - 1];
  const chartLabels = tokensInfo.map((info: any) => info.cycle_number);
  const activePools = tokensInfo[0].tokens;

  const datasets: any[] = [];

  datasets.push({
    label: "BTC Yield",
    data: tokensInfo.map((info: any) => info.rewards_amount),
    type: "line",
    yAxisID: "yRight",
  });

  for (const activePool of activePools) {
    const data: any[] = [];

    for (const cycleInfo of tokensInfo) {
      const stacked = cycleInfo.tokens.filter(
        (token: any) => token.name == activePool.name
      )[0].stacked_amount;
      data.push(stacked);
    }

    datasets.push({
      label: activePool.name,
      data: data,
    });
  }

  const chartData = {
    labels: chartLabels,
    datasets: datasets,
  };

  return (
    <main className="flex flex-col justify-between w-full max-w-5xl pt-12">
      <div className="flex gap-3">
        <div className="w-4/12 rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-2">
          <div>
            Current cycle:{" "}
            <span className="font-semibold">{lastCycleInfo.cycle_number}</span>
          </div>
          <div>
            Total LSTs:{" "}
            <span className="font-semibold">{lastCycleInfo.tokens.length}</span>
          </div>
          <div>
            Total stacked:{" "}
            <span className="font-semibold">
              {currency.rounded.format(lastCycleInfo.stacked_amount)} STX
            </span>
          </div>
          <div>
            Total rewards:{" "}
            <span className="font-semibold">
              {currency.short.format(lastCycleInfo.rewards_amount)} BTC
            </span>
          </div>
        </div>
        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
          <ChartBarStacked
            chartTitles={{ x: "Cycle", y: "STX Stacked", yRight: "BTC Yield" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div
        key={lastCycleInfo.cycle_number}
        className="pb-4 mb-12 bg-white rounded-lg mt-3"
      >
        <Table
          columnTitles={["LST", "Stacked", "Rewards"]}
          rows={lastCycleInfo.tokens.map((token: any) => [
            <div key={token.name} className="flex font-semibold">
              <img className="w-5 mr-2" src={token.logo} /> {token.name}
            </div>,
            `${currency.rounded.format(token.stacked_amount)} STX (${currency.rounded.format((token.stacked_amount / lastCycleInfo.stacked_amount) * 100.0)}%)`,
            `${currency.short.format(token.rewards_amount)} BTC (${currency.rounded.format((token.rewards_amount / lastCycleInfo.rewards_amount) * 100.0)}%)`,
            <a
              key={token.slug}
              href={`/tokens/${token.slug}`}
              className="underline hover:no-underline"
            >
              LST Details
            </a>,
          ])}
        />
      </div>
    </main>
  );
}
