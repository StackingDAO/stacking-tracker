import { FunctionComponent } from "react";
import { Table } from "../../components/Table";
import * as api from "../../common/public-api";
import { currency } from "@/app/common/utils";
import ChartBarStacked from "@/app/components/ChartBarStacked";

type Props = {
  params: {
    token: string;
  };
};

const Home: FunctionComponent<Props> = async ({ params: { token } }: Props) => {
  const tokenInfo = await api.get(`/token/${token}`);

  const chartLabels = tokenInfo.cycles.map((info: any) => info.cycle_number);
  const dataStacked = tokenInfo.cycles.map((info: any) => info.stacked_amount);
  const dataRewards = tokenInfo.cycles.map((info: any) => info.rewards_amount);

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
          <img className="w-10 mr-2 pb-4" src={tokenInfo.logo} />
          <div className="font-semibold">{tokenInfo.name}</div>
          <div>{tokenInfo.entity}</div>
          <a className="underline hover:no-underline" href={tokenInfo.website}>
            {tokenInfo.website}
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
            { title: "Signer" },
            { title: "Stacked" },
            { title: "Rewards" },
          ]}
          rows={tokenInfo.cycles
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
