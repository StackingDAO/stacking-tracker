import { FunctionComponent } from "react";
import { Table } from "./components/Table";
import * as api from "./common/public-api";
import { currency } from "@/app/common/utils";
import ChartBarStacked from "@/app/components/ChartBarStacked";

type Props = {
  params: {
    pool: string;
  };
};

const Home: FunctionComponent<Props> = async ({ params: { pool } }: Props) => {
  const poxInfo = await api.get(`/pox`);

  const lastCycleInfo = poxInfo.cycles[poxInfo.cycles.length - 1];
  const chartLabels = poxInfo.cycles.map((info: any) => info.cycle_number);
  const dataStacked = poxInfo.cycles.map((info: any) => info.stacked_amount);
  const dataRewards = poxInfo.cycles.map((info: any) => info.rewards_amount);

  const datasets: any[] = [];
  datasets.push({
    label: "Rewards BTC",
    data: dataRewards,
    type: "line",
    yAxisID: "yRight",
  });
  datasets.push({
    label: "Stacked STX",
    data: dataStacked,
  });

  const chartData = {
    labels: chartLabels,
    datasets: datasets,
  };

  return (
    <main className="flex flex-col justify-between w-full max-w-5xl pt-12">
      <div className="flex gap-3">
        <div className="w-4/12 rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-2">
          <div className="font-semibold">
            Current cycle:{" "}
            <span className="font-semibold">{lastCycleInfo.cycle_number}</span>
          </div>
          <div>
            Total stacked:{" "}
            <div>
              <span className="font-semibold">
                {currency.rounded.format(lastCycleInfo.stacked_amount)} STX
              </span>{" "}
              <span className="text-sm">
                $
                {currency.rounded.format(
                  lastCycleInfo.stacked_amount * poxInfo.prices.stx
                )}
              </span>
            </div>
          </div>
          <div>
            Total rewards:{" "}
            <div>
              <span className="font-semibold">
                {currency.short.format(lastCycleInfo.rewards_amount)} BTC
              </span>{" "}
              <span className="text-sm">
                $
                {currency.rounded.format(
                  lastCycleInfo.rewards_amount * poxInfo.prices.btc
                )}
              </span>
            </div>
          </div>
          <div>
            Started{" "}
            <span className="font-semibold">
              ~
              {currency.rounded.format(
                (poxInfo.current_burn_block -
                  (poxInfo.next_cycle_reward_start_block - 2100)) /
                  144
              )}{" "}
              days ago
            </span>
          </div>
          <div>
            Ends in{" "}
            <span className="font-semibold">
              ~
              {currency.rounded.format(
                (poxInfo.next_cycle_reward_start_block -
                  poxInfo.current_burn_block) /
                  144
              )}{" "}
              days
            </span>
          </div>

          <div className="pt-3 font-semibold">
            Next cycle: <span>{lastCycleInfo.cycle_number + 1}</span>
          </div>
          <div>
            Prepare phase in ~
            {currency.rounded.format(
              (poxInfo.next_cycle_prepare_start_block -
                poxInfo.current_burn_block) /
                144
            )}{" "}
            days at ₿ #{poxInfo.next_cycle_prepare_start_block}
          </div>
          <div>
            Reward phase in ~
            {currency.rounded.format(
              (poxInfo.next_cycle_reward_start_block -
                poxInfo.current_burn_block) /
                144
            )}{" "}
            days at ₿ #{poxInfo.next_cycle_reward_start_block}
          </div>
        </div>
        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
          <ChartBarStacked
            chartTitles={{ x: "Cycle", y: "STX Stacked", yRight: "BTC Yield" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div className="pb-4 mb-3 bg-white rounded-lg mt-3">
        <Table
          columnTitles={["Cycle", "Signers", "Pools", "Stacked", "Rewards"]}
          rows={poxInfo.cycles
            .reverse()
            .map((info: any) => [
              info.cycle_number,
              info.signers_count,
              info.pools_count,
              `${currency.rounded.format(info.stacked_amount)} STX`,
              `${currency.short.format(info.rewards_amount)} BTC`,
            ])}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-2">
        <div>
          Liquid STX supply:{" "}
          <span className="font-semibold">
            {currency.rounded.format(
              poxInfo.details.total_liquid_supply_ustx / 1000000.0
            )}{" "}
            STX
          </span>
        </div>
        <div>
          Next cycle min threshold:{" "}
          <span className="font-semibold">
            {currency.rounded.format(
              poxInfo.details.next_cycle_min_threshold_ustx / 1000000.0
            )}{" "}
            STX
          </span>
        </div>
        <div>
          Prepare phase length:{" "}
          <span className="font-semibold">
            {poxInfo.details.prepare_phase_block_length} bitcoin blocks
          </span>
        </div>
        <div>
          Reward phase length:{" "}
          <span className="font-semibold">
            {poxInfo.details.reward_phase_block_length} bitcoin blocks
          </span>
        </div>
      </div>
    </main>
  );
};

export default Home;
