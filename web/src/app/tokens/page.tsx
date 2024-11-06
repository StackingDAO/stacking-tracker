import { Table } from "../components/Table";
import * as api from "../common/public-api";
import { currency } from "@/app/common/utils";
import ChartBarStacked from "../components/ChartBarStacked";
import { ToolTip } from "../components/Tooltip";
import StxLogo from "../components/Logos/Stx";
import BtcLogo from "../components/Logos/Btc";

export default async function Home() {
  const tokensInfo = await api.get("/tokens");

  const lastCycleInfo = tokensInfo.cycles[tokensInfo.cycles.length - 1];
  const chartLabels = tokensInfo.cycles.map((info: any) => info.cycle_number);
  const activePools = lastCycleInfo.tokens;
  const datasets: any[] = [];

  datasets.push({
    label: "BTC Yield",
    data: tokensInfo.cycles.map((info: any) => info.rewards_amount),
    type: "line",
    yAxisID: "yRight",
    backgroundColor: "rgba(247, 147, 26, 1)",
    borderColor: "rgba(247, 147, 26, 1)",
  });

  const colors = ["rgba(46, 125, 89, 0.5)", "rgba(252, 100, 50, 0.5)"];
  for (const activePool of activePools) {
    const data: any[] = [];

    for (const cycleInfo of tokensInfo.cycles) {
      const stacked = cycleInfo.tokens.filter(
        (token: any) => token.name == activePool.name
      )[0].stacked_amount;
      data.push(stacked);
    }

    const index = activePools.indexOf(activePool);
    datasets.push({
      label: activePool.name,
      data: data,
      backgroundColor: colors[index],
      borderRadius: 6,
    });
  }

  const chartData = {
    labels: chartLabels,
    datasets: datasets,
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl mb-6 lg:hidden font-semibold">LSTs</h1>

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
                Total LSTs
              </dt>
              <dd className="text-lg text-white">
                {lastCycleInfo.tokens.length}
              </dd>
            </div>

            <div className="p-4 rounded-md bg-gray">
              <dt className="text-sm font-medium leading-6 text-white/50">
                Total stacked in LSTs
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
        <div className="h-[325px] lg:min-h-[460px]">
          <ChartBarStacked
            chartTitles={{ x: "Cycle", y: "STX Stacked", yRight: "BTC Yield" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl mt-8">
        <div key={lastCycleInfo.cycle_number}>
          <Table
            columnHeaders={[
              { title: "LST" },
              { title: "Entity" },
              { title: "Token Supply / Mcap" },
              { title: "Stacked" },
              {
                title: "Rewards",
                info: "Total rewards so far in this cycle. The cycle is still in progress.",
              },
              {
                title: "Gross APY",
                info: "Based on last 4 cycles and current prices. Not taking into account protocol fees.",
              },
              {
                title: "",
              },
            ]}
            rows={tokensInfo.entities.map((entity: any) => [
              <div key={entity.name} className="flex font-semibold">
                <img className="w-5 mr-2" src={entity.logo_token} />{" "}
                {entity.name}
              </div>,
              <div key={entity.entity} className="flex">
                <img className="w-5 mr-2" src={entity.logo} /> {entity.entity}
              </div>,
              <div key={entity.name + "-token"}>
                <div>{`${currency.rounded.format(entity.token_supply)} ${entity.name}`}</div>
                <div className="text-xs text-white/[0.35]">{`$${currency.short.format(entity.token_mcap)}`}</div>
              </div>,
              <div key={entity.name + "-stacked"}>
                <div className="flex items-center">
                  {`${currency.rounded.format(entity.stacked_amount)}`}
                  <StxLogo className="w-3 h-3 ml-1 inline" />
                </div>
                <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(entity.stacked_amount_usd)}`}</div>
              </div>,
              <div key={entity.name + "-rewards"}>
                <div className="flex items-center">
                  {`${currency.short.format(entity.rewards_amount)}`}
                  <BtcLogo className="w-3 h-3 ml-1 inline" />
                </div>
                <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(entity.rewards_amount_usd)}`}</div>
              </div>,
              `${currency.short.format(entity.apy)}%`,
              <div className="text-right" key={entity.slug}>
                <a
                  href={`/tokens/${entity.slug}`}
                  className="text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                >
                  LST details
                </a>
              </div>,
            ])}
          />
        </div>
      </div>
    </div>
  );
}
