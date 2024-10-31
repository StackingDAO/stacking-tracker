import { FunctionComponent } from "react";
import { Table } from "../../components/Table";
import * as api from "../../common/public-api";
import { currency, shortAddress } from "@/app/common/utils";
import ChartBarStacked from "@/app/components/ChartBarStacked";

type Props = {
  params: {
    signer: string;
  };
};

const Home: FunctionComponent<Props> = async ({
  params: { signer },
}: Props) => {
  const signerInfo = await api.get(`/signer/${signer}`);

  const chartLabels = signerInfo.cycles.map((info: any) => info.cycle_number);
  const dataStacked = signerInfo.cycles.map((info: any) => info.stacked_amount);
  const dataRewards = signerInfo.cycles.map((info: any) => info.rewards_amount);

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
    backgroundColor: "rgba(252, 100, 50, 0.5)",
    borderRadius: 6,
    borderSkipped: false,
  });

  const chartData = {
    labels: chartLabels,
    datasets: datasets,
  };

  return (
    <div className="flex flex-col justify-between w-full">
      <div className="flex gap-3">
        <div className="w-4/12 rounded-lg border border-gray-200 bg-transparent p-4 flex flex-col gap-2">
          <img
            className="w-10 mr-2 pb-4"
            src={signerInfo.logo ?? "/logos/default.webp"}
          />
          <div className="font-semibold">
            {signerInfo.name ?? "Unknown Signer"}
          </div>
          <div>{shortAddress(signerInfo.signer_key)}</div>
          <a className="underline hover:no-underline" href={signerInfo.website}>
            {signerInfo.website}
          </a>
        </div>
        <div className="flex-1 rounded-lg border border-gray-200 bg-transparent p-4">
          <ChartBarStacked
            chartTitles={{ x: "Cycle", y: "STX Stacked", yRight: "BTC Yield" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div className="">
        <Table
          columnHeaders={[
            { title: "Cycle" },
            { title: "Stackers" },
            { title: "Stacked" },
            { title: "Rewards" },
          ]}
          rows={signerInfo.cycles
            .reverse()
            .map((info: any) => [
              info.cycle_number,
              info.stackers_count,
              `${currency.rounded.format(info.stacked_amount)} STX`,
              `${currency.short.format(info.rewards_amount)} BTC`,
            ])}
        />
      </div>
    </div>
  );
};

export default Home;
