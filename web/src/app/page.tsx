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

  const lastCycleInfo = poxInfo[poxInfo.length - 1];
  const chartLabels = poxInfo.map((info: any) => info.cycle_number);
  const dataStacked = poxInfo.map((info: any) => info.stacked_amount);
  const dataRewards = poxInfo.map((info: any) => info.rewards_amount);

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
          <div>
            Current cycle:{" "}
            <span className="font-semibold">{lastCycleInfo.cycle_number}</span>
          </div>
          <div>
            Total Signers:{" "}
            <span className="font-semibold">{lastCycleInfo.signers_count}</span>
          </div>
          <div>
            Total public pools:{" "}
            <span className="font-semibold">{lastCycleInfo.pools_count}</span>
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

      <div className="pb-4 mb-12 bg-white rounded-lg mt-3">
        <Table
          columnTitles={["Cycle", "Signers", "Pools", "Stacked", "Rewards"]}
          rows={poxInfo
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
    </main>
  );
};

export default Home;
