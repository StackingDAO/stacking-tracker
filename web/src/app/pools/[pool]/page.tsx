import { FunctionComponent } from "react";
import { Table } from "../../components/Table";
import * as api from "../../common/public-api";
import { currency } from "@/app/common/utils";
import ChartBarStacked from "@/app/components/ChartBarStacked";

type Props = {
  params: {
    pool: string;
  };
};

const Home: FunctionComponent<Props> = async ({ params: { pool } }: Props) => {
  const poolInfo = await api.get(`/pool/${pool}`);

  const chartLabels = poolInfo.cycles.map((info: any) => info.cycle_number);
  const dataStacked = poolInfo.cycles.map((info: any) => info.stacked_amount);
  const dataRewards = poolInfo.cycles.map((info: any) => info.rewards_amount);

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
          <img className="w-10 mr-2 pb-4" src={poolInfo.logo} />
          <div className="font-semibold">{poolInfo.name}</div>
          <a className="underline hover:no-underline" href={poolInfo.website}>
            {poolInfo.website}
          </a>
        </div>
        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
          <ChartBarStacked
            chartTitles={{ x: "Cycle", y: "STX Stacked", yRight: "BTC Yield" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div className="mb-12 bg-white rounded-lg mt-3">
        <Table
          columnHeaders={[
            { title: "Cycle" },
            { title: "Stacked" },
            { title: "Rewards" },
          ]}
          rows={poolInfo.cycles
            .reverse()
            .map((info: any) => [
              info.cycle_number,
              `${currency.rounded.format(info.stacked_amount)} STX`,
              `${currency.short.format(info.rewards_amount)} BTC`,
            ])}
        />
      </div>
    </main>
  );
};

export default Home;
