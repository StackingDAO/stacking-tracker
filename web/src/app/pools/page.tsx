import { Table } from "../components/Table";
import * as api from "../common/public-api";
import { currency } from "@/app/common/utils";
import ChartBarStacked from "../components/ChartBarStacked";
import { ToolTip } from "../components/Tooltip";
import StxLogo from "../components/Logos/Stx";
import BtcLogo from "../components/Logos/Btc";

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
    backgroundColor: "rgba(247, 147, 26, 1)",
    borderColor: "rgba(247, 147, 26, 1)",
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

    const index = activePools.indexOf(activePool);
    datasets.push({
      label: activePool.name,
      data: data,
      backgroundColor: `rgba(252, 100, 50, ${1 - index * 0.2})`,
      borderRadius: 6,
    });
  }

  const chartData = {
    labels: chartLabels,
    datasets: datasets,
  };

  return (
    <div className="flex flex-col w-full">
      <div className="p-4 border border-white/10 rounded-xl">
        <div className="flex items-center gap-x-2">
          <h2 className="ml-4 font-semibold text-xl">
            Cycle {lastCycleInfo.cycle_number}
          </h2>
          <span className="px-2 py-1 text-green bg-green/10 text-sm rounded-md">
            Current Cycle
          </span>
        </div>

        <div className="mt-4">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-md bg-gray">
              <dt className="text-sm font-medium leading-6 text-white/50">
                Total public pools
              </dt>
              <dd className="text-lg text-white">
                {lastCycleInfo.pools.length}
              </dd>
            </div>

            <div className="p-4 rounded-md bg-gray">
              <dt className="text-sm font-medium leading-6 text-white/50">
                Total stacked in stacking pools
              </dt>
              <dd className="text-lg text-white">
                <div className=" inline-flex items-center w-full text-lg font-medium leading-6 text-white gap-x-1">
                  <StxLogo className="w-[18px] h-[18px] shrink-0" />
                  {currency.rounded.format(lastCycleInfo.stacked_amount)}
                </div>
                <p className="text-sm text-white/[0.35] ">
                  ${currency.rounded.format(lastCycleInfo.stacked_amount_usd)}
                </p>
              </dd>
            </div>

            <div className="p-4 rounded-md bg-gray">
              <dt className="text-sm font-medium leading-6 text-white/50">
                <div className="flex items-center gap-1">
                  Total rewards so far
                  <ToolTip
                    id="tooltip_rewards"
                    text={
                      "Total rewards so far in this cycle. The cycle is still in progress."
                    }
                  />
                </div>
              </dt>
              <dd className="text-lg text-white">
                <div className=" inline-flex items-center w-full text-lg font-medium leading-6 text-white gap-x-1">
                  <BtcLogo className="w-[18px] h-[18px] shrink-0" />
                  {currency.short.format(lastCycleInfo.rewards_amount)}
                </div>
                <p className="text-sm text-white/[0.35] ">
                  ${currency.rounded.format(lastCycleInfo.rewards_amount_usd)}
                </p>{" "}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl mt-8">
        <div className="sm:min-h-[400px]">
          <ChartBarStacked
            chartTitles={{ x: "Cycle", y: "STX Stacked" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl mt-8">
        <div
          key={lastCycleInfo.cycle_number}
          className="bg-transparent rounded-lg mt-3"
        >
          <Table
            columnHeaders={[
              { title: "Pool" },
              { title: "Stacked" },
              {
                title: "BTC rewards so far",
                info: "Total rewards so far in this cycle. The cycle is still in progress.",
              },
              {
                title: "Gross APY",
                info: "Based on the previous 4 cycles and current prices. Not taking into account pool fees.",
              },
              { title: "" },
            ]}
            rows={poolsInfo.entities.map((entity: any) => [
              <div key={entity.name} className="flex font-semibold">
                <img className="w-5 mr-2" src={entity.logo} /> {entity.name}
              </div>,
              <div key={entity.name + "-stacked"}>
                <div>{`${currency.rounded.format(entity.stacked_amount)} STX`}</div>
                <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(entity.stacked_amount_usd)}`}</div>
              </div>,
              <div key={entity.name + "-rewards"}>
                <div>{`${currency.short.format(entity.rewards_amount)} BTC`}</div>
                <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(entity.rewards_amount_usd)}`}</div>
              </div>,
              `${currency.short.format(entity.apy)}%`,
              <div key={entity.slug} className="text-right">
                <a
                  href={`/pools/${entity.slug}`}
                  className="text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                >
                  View rewards history
                </a>
              </div>,
            ])}
          />
        </div>
      </div>
    </div>
  );
}
