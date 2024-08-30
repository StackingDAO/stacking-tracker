import { Table } from "../components/Table";
import * as api from "../common/public-api";
import { currency, shortAddress } from "@/app/common/utils";
import ChartBarStacked from "../components/ChartBarStacked";

export default async function Home() {
  const signersInfo = await api.get("/signers");

  const lastCycleInfo = signersInfo[signersInfo.length - 1];
  const chartLabels = signersInfo.map((info: any) => info.cycle_number);

  const datasets: any[] = [];

  datasets.push({
    label: "BTC Yield",
    data: signersInfo.map((info: any) => info.rewards_amount),
    type: "line",
    yAxisID: "yRight",
  });

  for (const activeSigner of signersInfo[0].signers_grouped) {
    const data: any[] = [];
    for (const cycleInfo of signersInfo) {
      const stacked = cycleInfo.signers_grouped.filter(
        (signer: any) => signer.name == activeSigner.name
      )[0].stacked_amount;
      data.push(stacked);
    }

    datasets.push({
      label: activeSigner.name,
      data: data,
    });
  }

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
            Total signers:{" "}
            <span className="font-semibold">
              {lastCycleInfo.signers.length}
            </span>
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
            chartTitles={{ x: "Cycle", y: "STX Stacked" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div
        key={lastCycleInfo.cycle_number}
        className="mb-12 bg-white rounded-lg mt-3"
      >
        <Table
          columnTitles={["Signer", "Stackers", "Stacked", "Rewards"]}
          rows={lastCycleInfo.signers.map((signer: any) => [
            signer.name ? (
              <div key={signer.name} className="flex font-semibold">
                <img className="w-5 mr-2" src={signer.logo} /> {signer.name}
              </div>
            ) : (
              shortAddress(signer.signer_key)
            ),
            signer.stackers_count,
            `${currency.rounded.format(signer.stacked_amount)} STX (${currency.rounded.format((signer.stacked_amount / lastCycleInfo.stacked_amount) * 100.0)}%)`,
            `${currency.short.format(signer.rewards_amount)} BTC (${currency.rounded.format((signer.rewards_amount / lastCycleInfo.rewards_amount) * 100.0)}%)`,
            <a
              key={signer.slug}
              href={`/signers/${signer.slug ?? signer.signer_key}`}
              className="underline hover:no-underline"
            >
              Signer Details
            </a>,
          ])}
        />
      </div>
    </main>
  );
}
