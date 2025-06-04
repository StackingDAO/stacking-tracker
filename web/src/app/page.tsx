import { FunctionComponent } from "react";
import { Table } from "./components/Table";
import * as api from "./common/public-api";
import {
  currency,
  generateMetaData,
  numberToDaysAndHours,
} from "@/app/common/utils";
import ChartBarStacked from "@/app/components/ChartBarStacked";
import { ToolTip } from "./components/Tooltip";
import StxLogo from "./components/Logos/Stx";
import BtcLogo from "./components/Logos/Btc";
import { Pending } from "./components/Pending";
import { Info } from "./components/Info";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

type Props = {
  params: {
    pool: string;
  };
};

export async function generateMetadata() {
  const poxInfo = await api.get(`/pox`);
  const info = {
    title: `Stacking Tracker - Cycle ${poxInfo.current_cycle.cycle_number}`,
    description: `All your data needs on PoX, LSTs, Pools and Signers on Stacks! In total ${currency.rounded.format(poxInfo.current_cycle.stacked_amount)} STX is stacked in cycle ${poxInfo.current_cycle.cycle_number}. The current cycle ends in ${currency.rounded.format(poxInfo.current_cycle.ends_in_days)} days.`,
  };
  return generateMetaData(info.title, info.description);
}

const Home: FunctionComponent<Props> = async ({ params: { pool } }: Props) => {
  const poxInfo = await api.get(`/pox`);
  const chartLabels = poxInfo.cycles.map((info: any) => info.cycle_number);
  const dataStacked = poxInfo.cycles.map((info: any) => info.stacked_amount);
  const dataRewards = poxInfo.cycles.map(
    (info: any) => info.extrapolated_rewards_amount || info.rewards_amount
  );
  const lastCycle = poxInfo.cycles[poxInfo.cycles.length - 1];

  const datasets: any[] = [];
  datasets.push({
    label: "Rewards BTC",
    data: dataRewards,
    type: "line",
    yAxisID: "yRight",
    borderColor: "rgba(247, 147, 26, 1)",
    backgroundColor: "rgba(247, 147, 26, 1)",
    highlightLastSegment: true,
  });

  datasets.push({
    label: "Stacked STX",
    data: dataStacked,
    backgroundColor: "rgba(252, 100, 50, 0.5)",
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
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-2xl mb-6 lg:hidden font-semibold">
          Stacking Overview
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

              <div className="mx-4">
                <div className="flex items-center gap-2 text-sm text-white/[0.35] pb-1">
                  <div className="flex-1">Start</div>
                  <div>End</div>
                </div>
                <div className="bg-green/10 rounded-full mb-3">
                  <div
                    className="bg-green rounded-full h-3 mb-3"
                    style={{
                      width: `${Math.round((poxInfo.current_cycle.started_days_ago / 15) * 100)}%`,
                    }}
                  ></div>
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
                    <p className="text-sm text-white/[0.35]">
                      $
                      {currency.rounded.format(
                        poxInfo.current_cycle.stacked_amount_usd
                      )}
                    </p>
                  </dd>
                </div>
                <div className="p-4 rounded-md bg-gray">
                  <dt className="text-sm font-medium leading-6 text-white/50 flex gap-1 items-center">
                    BTC Rewards So Far
                    <ToolTip
                      id="tooltip_btc_reward_so_far"
                      text={
                        "The cycle is in progress and BTC Rewards are streamed to stackers on a per block basis."
                      }
                    />
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
                    ~{" "}
                    {currency.rounded.format(
                      poxInfo.current_cycle.started_days_ago
                    )}{" "}
                    Days Ago
                    <p className="text-sm text-white/[0.35]">
                      {getFormattedDate(
                        -poxInfo.current_cycle.started_days_ago
                      )}
                    </p>
                  </dd>
                </div>
                <div className="p-4 rounded-md bg-gray">
                  <dt className="text-sm font-medium leading-6 text-white/50">
                    Ends in
                  </dt>
                  <dd className="w-full text-lg font-medium leading-6 text-white">
                    ~{" "}
                    {currency.rounded.format(
                      poxInfo.current_cycle.ends_in_days
                    )}{" "}
                    Days
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
                      Prepare Phase In
                      <ToolTip
                        id="tooltip_prepare_phase"
                        text={
                          "Prepare Phase is the start of a cycle where no rewards are earned for 100 Bitcoin blocks."
                        }
                      />
                    </div>
                  </dt>
                  <dd>
                    ~ {numberToDaysAndHours(poxInfo.next_cycle.starts_in_days)}
                    <p className="text-sm text-white/[0.35] mt-0.5">
                      Block #{poxInfo.next_cycle.prepare_phase_start_block}
                    </p>
                  </dd>
                </div>
                <div className="p-4 rounded-md bg-gray">
                  <dt className="text-sm font-medium leading-6 text-white/50">
                    <div className="flex items-center gap-1">
                      Rewards Phase In
                      <ToolTip
                        id="tooltip_reward_phase"
                        text={
                          "Reward Phase is the part of the cycle where BTC rewards are earned by stackers."
                        }
                      />
                    </div>
                  </dt>
                  <dd>
                    ~{" "}
                    {currency.rounded.format(poxInfo.next_cycle.starts_in_days)}{" "}
                    Days
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
            <h2 className="text-xl font-semibold">Stacking Cycles Overview</h2>
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
                  <div key={`pools-${index}`}>
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
                  <div key={`apy-${index}`}>
                    <dt className="text-sm font-medium leading-6 text-white/50 flex gap-1 items-center">
                      Gross APY
                      <ToolTip
                        id="tooltip_apy"
                        text={
                          "Calculated using STX and BTC prices at the end of the cycle."
                        }
                      />
                    </dt>
                    <dd>
                      {index === 0 ? (
                        <span className="flex flex-col gap-1 w-fit">
                          <div className="flex items-center">
                            {currency.short.format(info.apy)}%
                            <ArrowRightIcon className="w-4 h-4 mx-1 text-white/30" />
                            <span className="opacity-70">
                              {currency.short.format(info.extrapolated_apy)}%
                            </span>
                          </div>
                          <div>
                            <Pending />
                          </div>
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
                      {index === 0 ? (
                        <span className="flex flex-col gap-1 w-fit">
                          <div className="flex items-center">
                            {currency.short.format(info.rewards_amount)}
                            <ArrowRightIcon className="w-4 h-4 mx-1 text-white/30" />
                            <span className="opacity-70">
                              {currency.short.format(
                                info.extrapolated_rewards_amount
                              )}
                            </span>
                            <BtcLogo className="w-[12px] h-[12px] ml-1" />
                          </div>
                          <div>
                            <Pending />
                          </div>
                        </span>
                      ) : (
                        <div
                          className="flex items-center"
                          key={`rewards-${index}`}
                        >
                          {currency.short.format(info.rewards_amount)}
                          <BtcLogo className="w-[12px] h-[12px] ml-1" />
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <h2 className="text-lg font-semibold mb-4">
              Stacking cycles overview
            </h2>

            <Table
              columnHeaders={[
                { title: "Cycle" },
                { title: "Signers" },
                { title: "Pools" },
                { title: "Stackers" },
                { title: "Stacked" },
                {
                  title: "Gross APY",
                  info: "Calculated using STX and BTC prices at the end of the cycle.",
                },
                { title: "Rewards" },
              ]}
              rows={poxInfo.cycles.map((info: any, index: number) => [
                info.cycle_number,
                info.signers_count,
                info.pools_count,
                info.stackers_count,
                <div className="flex items-center" key={`stacked-${index}`}>
                  {currency.rounded.format(info.stacked_amount)}
                  <StxLogo className="w-[12px] h-[12px] ml-1" />
                </div>,
                index === 0 ? (
                  <div key={`apy-${index}`} className="flex items-center">
                    <div className="flex items-center gap-x-1">
                      {currency.short.format(info.apy)}%
                      <ArrowRightIcon className="w-4 h-4 text-white/30" />
                      <div className="opacity-70">
                        {currency.short.format(info.extrapolated_apy)}%
                      </div>
                      <Pending iconOnly highlightTooltip={false} />
                    </div>
                  </div>
                ) : (
                  `${currency.short.format(info.apy)}%`
                ),
                index === 0 ? (
                  <div key={`rewards-${index}`} className="flex items-center">
                    <div className="flex items-center gap-x-1">
                      {currency.short.format(info.rewards_amount)}
                      <ArrowRightIcon className="w-4 h-4 text-white/30" />
                      <div className="opacity-70">
                        {currency.short.format(
                          info.extrapolated_rewards_amount
                        )}
                      </div>
                      <BtcLogo className="w-[12px] h-[12px] ml-1" />
                      <Pending iconOnly highlightTooltip={false} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center" key={`rewards-${index}`}>
                    {currency.short.format(info.rewards_amount)}
                    <BtcLogo className="w-[12px] h-[12px] ml-1" />
                  </div>
                ),
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
      <section className="py-8">
        <Info
          liquidStxSupply={poxInfo.details.total_liquid_supply_stx}
          nextCycleMinThreshold={poxInfo.details.next_cycle_min_threshold_stx}
          preparePhaseLength={poxInfo.details.prepare_phase_block_length}
          rewardPhaseLength={poxInfo.details.reward_phase_block_length}
        />
      </section>
    </>
  );
};

export default Home;
