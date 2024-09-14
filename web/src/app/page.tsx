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
      <div className="flex gap-3 pt-3">
        <div className="w-4/12 rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-2">
          <div className="font-semibold">
            Current cycle:{" "}
            <span className="font-semibold">
              {poxInfo.current_cycle.cycle_number}
            </span>
          </div>
          <div>
            Total stacked:{" "}
            <div>
              <span className="font-semibold">
                {currency.rounded.format(poxInfo.current_cycle.stacked_amount)}{" "}
                STX
              </span>{" "}
              <span className="text-sm">
                $
                {currency.rounded.format(
                  poxInfo.current_cycle.stacked_amount_usd
                )}
              </span>
            </div>
          </div>
          <div>
            Total rewards:{" "}
            <div>
              <span className="font-semibold">
                {currency.short.format(poxInfo.current_cycle.rewards_amount)}{" "}
                BTC
              </span>{" "}
              <span className="text-sm">
                $
                {currency.rounded.format(
                  poxInfo.current_cycle.rewards_amount_usd
                )}
              </span>
            </div>
          </div>
          <div>
            Started{" "}
            <span className="font-semibold">
              ~{currency.rounded.format(poxInfo.current_cycle.started_days_ago)}{" "}
              days ago
            </span>
          </div>
          <div>
            Ends in{" "}
            <span className="font-semibold">
              ~{currency.rounded.format(poxInfo.current_cycle.ends_in_days)}{" "}
              days
            </span>
          </div>

          <div className="pt-3 font-semibold">
            Next cycle: <span>{poxInfo.next_cycle.cycle_number + 1}</span>
          </div>
          <div>
            Prepare phase in ~
            {currency.rounded.format(poxInfo.next_cycle.starts_in_days - 1)}{" "}
            days at ₿ #{poxInfo.next_cycle.prepare_phase_start_block}
          </div>
          <div>
            Reward phase in ~
            {currency.rounded.format(poxInfo.next_cycle.starts_in_days)} days at
            ₿ #{poxInfo.next_cycle.reward_phase_start_block}
          </div>
        </div>
        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
          <ChartBarStacked
            chartTitles={{ x: "Cycle", y: "STX Stacked", yRight: "BTC Yield" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div className="mb-3 bg-white rounded-lg mt-3">
        <Table
          columnHeaders={[
            { title: "Cycle" },
            { title: "Signers" },
            { title: "Pools", info: "Amount of known pools" },
            { title: "Stacked" },
            { title: "Rewards" },
            { title: "APY", info: "Based on current prices" },
          ]}
          rows={poxInfo.cycles
            .reverse()
            .map((info: any) => [
              info.cycle_number,
              info.signers_count,
              info.pools_count,
              `${currency.rounded.format(info.stacked_amount)} STX`,
              `${currency.short.format(info.rewards_amount)} BTC`,
              `${currency.short.format(info.apy)}%`,
            ])}
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-2">
        <div>
          Liquid STX supply:{" "}
          <span className="font-semibold">
            {currency.rounded.format(poxInfo.details.total_liquid_supply_stx)}{" "}
            STX
          </span>
        </div>
        <div>
          Next cycle min threshold:{" "}
          <span className="font-semibold">
            {currency.rounded.format(
              poxInfo.details.next_cycle_min_threshold_stx
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
