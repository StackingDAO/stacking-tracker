import { Table } from "../components/Table";
import * as api from "../common/public-api";
import { currency } from "@/app/common/utils";
import ChartBarStacked from "../components/ChartBarStacked";

export default async function Home() {
  const poolsInfo = await api.get("/pools");

  const lastCycleInfo = poolsInfo.cycles[poolsInfo.cycles.length - 1];
  const chartLabels = poolsInfo.cycles.map((info: any) => info.cycle_number);
  const activePools = lastCycleInfo.pools;
  const datasets: any[] = [];

  datasets.push({
    label: "BTC Yield",
    data: poolsInfo.cycles.map((info: any) => info.rewards_amount),
    type: "line",
    yAxisID: "yRight",
  });

  for (const activePool of activePools) {
    const data: any[] = [];
    for (const cycleInfo of poolsInfo.cycles) {
      const poolInfo = cycleInfo.pools.filter(
        (pool: any) => pool.name == activePool.name
      )[0];

      if (poolInfo) {
        data.push(poolInfo.stacked_amount);
      }
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
            Total public pools:{" "}
            <span className="font-semibold">{lastCycleInfo.pools.length}</span>
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
            chartTitles={{ x: "Cycle", y: "STX Stacked" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div
        key={lastCycleInfo.cycle_number}
        className="mb-12 bg-white rounded-lg mt-3"
      >
        <Table
          columnHeaders={[
            { title: "Pool" },
            { title: "Stacked" },
            { title: "Rewards" },
            {
              title: "Gross APY",
              info: "Based on the previous 4 cycles and current prices. Not taking into account pool fees.",
            },
          ]}
          rows={poolsInfo.entities.map((entity: any) => [
            <div key={entity.name} className="flex font-semibold">
              <img className="w-5 mr-2" src={entity.logo} /> {entity.name}
            </div>,
            <div key={entity.name + "-stacked"}>
              <div>{`${currency.rounded.format(entity.stacked_amount)} STX`}</div>
              <div>{`$${currency.rounded.format(entity.stacked_amount_usd)}`}</div>
            </div>,
            <div key={entity.name + "-rewards"}>
              <div>{`${currency.short.format(entity.rewards_amount)} BTC`}</div>
              <div>{`$${currency.rounded.format(entity.rewards_amount_usd)}`}</div>
            </div>,
            `${currency.short.format(entity.apy)}%`,
            <a
              key={entity.slug}
              href={`/pools/${entity.slug}`}
              className="underline hover:no-underline"
            >
              Pool Details
            </a>,
          ])}
        />
      </div>
    </main>
  );
}
