import { FunctionComponent } from "react";
import { Table } from "./components/Table";
import * as api from "./common/public-api";
import { currency } from "@/app/common/utils";
import ChartBarStacked from "@/app/components/ChartBarStacked";
import { ToolTip } from "./components/Tooltip";
import StxLogo from "./components/Logos/Stx";
import BtcLogo from "./components/Logos/Btc";

type Props = {
  params: {
    pool: string;
  };
};

const Home: FunctionComponent<Props> = async ({ params: { pool } }: Props) => {
  const poxInfo = await api.get(`/pox`);
  const chartLabels = poxInfo.cycles.map((info: any) => info.cycle_number);
  const dataStacked = poxInfo.cycles.map((info: any) => info.stacked_amount);
  const dataRewards = poxInfo.cycles.map((info: any) => info.rewards_amount);

  const datasets: any[] = [];
  datasets.push({
    label: "Rewards BTC",
    data: dataRewards,
    type: "line",
    yAxisID: "yRight",
    backgroundColor: "rgba(247, 147, 26, 1)",
    borderColor: "rgba(247, 147, 26, 1)",
  });
  datasets.push({
    label: "Stacked STX",
    data: dataStacked,
    backgroundColor: "rgba(252, 100, 50, 0.5)",
    borderRadius: 6,
    borderSkipped: false,
  });

  const chartData = {
    labels: chartLabels,
    datasets: datasets,
  };

  function getFormattedDate(days: number) {
    const today = new Date();
    const pastDate = new Date(today.setDate(today.getDate() + days));

    return pastDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl mb-6 lg:hidden font-semibold">
        Stacking overview
      </h1>
      <div className="lg:flex gap-8">
        <div className="lg:w-5/12 flex flex-col gap-6">
          <div className="p-4 border border-white/10 rounded-xl shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="ml-4 font-semibold text-xl">
                Cycle {poxInfo.current_cycle.cycle_number}
              </h3>
              <div className="px-2 py-1 text-green bg-green/10 text-sm rounded-md">
                Current Cycle
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="p-4 rounded-md bg-gray">
                <dt className="text-sm font-medium leading-6 text-white/50">
                  Total Stacked
                </dt>
                <dd>
                  <div className=" inline-flex items-center w-full text-lg font-medium leading-6 text-white gap-x-1">
                    <StxLogo className="w-[18px] h-[18px] shrink-0" />
                    {currency.rounded.format(
                      poxInfo.current_cycle.stacked_amount
                    )}
                  </div>
                  <p className="text-sm text-white/[0.35] ">
                    $
                    {currency.rounded.format(
                      poxInfo.current_cycle.stacked_amount_usd
                    )}
                  </p>
                </dd>
              </div>
              <div className="p-4 rounded-md bg-gray">
                <dt className="text-sm font-medium leading-6 text-white/50">
                  BTC rewards so far
                </dt>
                <dd>
                  <div className=" inline-flex items-center w-full text-lg font-medium leading-6 text-white gap-x-1">
                    <BtcLogo className="w-[18px] h-[18px] shrink-0" />
                    {currency.short.format(
                      poxInfo.current_cycle.rewards_amount
                    )}
                  </div>
                  <p className="text-sm text-white/[0.35] ">
                    $
                    {currency.rounded.format(
                      poxInfo.current_cycle.rewards_amount_usd
                    )}
                  </p>
                </dd>
              </div>
              <div className="p-4 rounded-md bg-gray">
                <dt className="text-sm font-medium leading-6 text-white/50">
                  Started
                </dt>
                <dd className="w-full text-lg font-medium leading-6 text-white">
                  ~
                  {currency.rounded.format(
                    poxInfo.current_cycle.started_days_ago
                  )}{" "}
                  days ago
                  <p className="text-sm text-white/[0.35]">
                    {getFormattedDate(-poxInfo.current_cycle.started_days_ago)}
                  </p>
                </dd>
              </div>
              <div className="p-4 rounded-md bg-gray">
                <dt className="text-sm font-medium leading-6 text-white/50">
                  Ends in
                </dt>
                <dd className="w-full text-lg font-medium leading-6 text-white">
                  ~{currency.rounded.format(poxInfo.current_cycle.ends_in_days)}{" "}
                  days
                  <p className="text-sm text-white/[0.35]">
                    {getFormattedDate(poxInfo.current_cycle.ends_in_days)}
                  </p>
                </dd>
              </div>
            </dl>
          </div>
          <div className="p-4 border border-white/10 rounded-xl shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="ml-4 font-semibold text-xl">
                Cycle {poxInfo.next_cycle.cycle_number}
              </h3>
              <div className="px-2 py-1 text-orange bg-orange/10 text-sm rounded-md">
                Next Cycle
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="p-4 rounded-md bg-gray">
                <dt className="text-sm font-medium leading-6 text-white/50">
                  <div className="flex items-center gap-1">
                    Prepare phase in
                    <ToolTip
                      id="tooltip_prepare_phase"
                      text={
                        "During the prepare phase STX tokens are locked for stacking in the next cycle."
                      }
                    />
                  </div>
                </dt>
                <dd>
                  {currency.rounded.format(
                    poxInfo.next_cycle.starts_in_days - 1
                  )}{" "}
                  days
                  <p className="text-sm text-white/[0.35] mt-0.5">
                    Block #{poxInfo.next_cycle.prepare_phase_start_block}
                  </p>
                </dd>
              </div>
              <div className="p-4 rounded-md bg-gray">
                <dt className="text-sm font-medium leading-6 text-white/50">
                  <div className="flex items-center gap-1">
                    Rewards phase in
                    <ToolTip
                      id="tooltip_reward_phase"
                      text={
                        "During the reward phase Bitcoin rewards are distributed to stackers."
                      }
                    />
                  </div>
                </dt>
                <dd>
                  {currency.rounded.format(poxInfo.next_cycle.starts_in_days)}{" "}
                  days
                  <p className="text-sm text-white/[0.35] mt-0.5">
                    Block #{poxInfo.next_cycle.reward_phase_start_block}
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="lg:w-7/12 p-4 border border-white/10 rounded-xl mt-4 lg:mt-0">
          <div className="h-[325px] lg:min-h-[460px]">
            <ChartBarStacked
              chartTitles={{
                x: "Cycle",
                y: "STX Stacked",
                yRight: "BTC Yield",
              }}
              chartData={chartData}
            />
          </div>
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl mt-8">
        <div className="lg:hidden">
          <h2 className="text-xl mb-6 font-semibold">
            Stacking cycles overview
          </h2>
          <div className="space-y-6 divide-y divide-white/10">
            {poxInfo.cycles.reverse().map((info: any, index: number) => (
              <dl
                key={`cycle-${index}`}
                className="grid gap-4 grid-cols-2 pt-6"
              >
                <div key={`cycle-number-${index}`}>
                  <dt className="text-sm font-medium leading-6 text-white/50">
                    Cycle
                  </dt>
                  <dd>{info.cycle_number}</dd>
                </div>
                <div key={`signers-${index}`}>
                  <dt className="text-sm font-medium leading-6 text-white/50">
                    Signers
                  </dt>
                  <dd>{info.signers_count}</dd>
                </div>
                <div key={`signers-${index}`}>
                  <dt className="text-sm font-medium leading-6 text-white/50">
                    Pools
                  </dt>
                  <dd>{info.pools_count}</dd>
                </div>
                <div key={`stacked-${index}`}>
                  <dt className="text-sm font-medium leading-6 text-white/50">
                    Stacked
                  </dt>
                  <dd className="flex items-center">
                    {currency.rounded.format(info.stacked_amount)}
                    <StxLogo className="w-[12px] h-[12px] ml-1" />
                  </dd>
                </div>
                <div key={`cycle-number-${index}`}>
                  <dt className="text-sm font-medium leading-6 text-white/50">
                    Gross APY
                  </dt>
                  <dd>
                    {index === 0 ? (
                      <span className="bg-orange/[0.15] text-orange py-0.5 px-1.5 inline-flex items-center rounded-md">
                        Pending
                        <ToolTip
                          id="tooltip_gross-apy"
                          text={
                            "The cycle is in progress and BTC rewards are streamed to stackers on a per block basis."
                          }
                          className="text-orange/50 ml-1"
                        ></ToolTip>
                      </span>
                    ) : (
                      `${currency.short.format(info.apy)}%`
                    )}
                  </dd>
                </div>
                <div key={`rewards-${index}`}>
                  <dt className="text-sm font-medium leading-6 text-white/50">
                    Rewards
                  </dt>
                  <dd className="flex items-center">
                    {currency.short.format(info.rewards_amount)}
                    <BtcLogo className="w-[12px] h-[12px] ml-1" />
                  </dd>
                </div>
              </dl>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <Table
            columnHeaders={[
              { title: "Cycle" },
              { title: "Signers" },
              { title: "Pools", info: "Amount of known pools" },
              { title: "Stacked" },
              {
                title: "Gross APY",
                info: "Based on current prices. Not taking into account pool or protocol fees.",
              },
              { title: "Rewards" },
            ]}
            rows={poxInfo.cycles.reverse().map((info: any, index: number) => [
              info.cycle_number,
              info.signers_count,
              info.pools_count,
              <div className="flex items-center" key={`stacked-${index}`}>
                {currency.rounded.format(info.stacked_amount)}
                <StxLogo className="w-[12px] h-[12px] ml-1" />
              </div>,
              index === 0 ? (
                <span className="bg-orange/[0.15] text-orange py-0.5 px-1.5 inline-flex items-center rounded-md">
                  Pending
                  <ToolTip
                    id="tooltip_gross-apy"
                    text={
                      "The cycle is in progress and BTC rewards are streamed to stackers on a per block basis."
                    }
                    className="text-orange/50 ml-1"
                  ></ToolTip>
                </span>
              ) : (
                `${currency.short.format(info.apy)}%`
              ),
              <div className="flex items-center" key={`rewards-${index}`}>
                {currency.short.format(info.rewards_amount)}
                <BtcLogo className="w-[12px] h-[12px] ml-1" />
              </div>,
            ])}
          />
          {/* <button
            type="button"
            className="flex items-center justify-center w-full text-sm font-semibold leading-6 text-orange px-3 py-1.5 rounded-lg bg-orange/10"
          >
            Show more cycles
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
