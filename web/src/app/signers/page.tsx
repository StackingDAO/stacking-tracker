import { Table } from "../components/Table";
import * as api from "../common/public-api";
import { currency, shortAddress } from "@/app/common/utils";
import ChartBarStacked from "../components/ChartBarStacked";

export default async function Home() {
  const signersInfo = await api.get("/signers");

  const lastCycleInfo = signersInfo.cycles[signersInfo.cycles.length - 1];
  const chartLabels = signersInfo.cycles.map((info: any) => info.cycle_number);
  const activeSigners = lastCycleInfo.signers;
  const datasets: any[] = [];

  datasets.push({
    label: "BTC Yield",
    data: signersInfo.cycles.map((info: any) => info.rewards_amount),
    type: "line",
    yAxisID: "yRight",
  });

  for (const activeSigner of activeSigners) {
    const data: any[] = [];
    for (const cycleInfo of signersInfo.cycles) {
      const signerInfo = cycleInfo.signers.filter(
        (signer: any) => signer.name == activeSigner.name
      )[0];

      if (signerInfo) {
        data.push(signerInfo.stacked_amount);
      }
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
            <span className="font-semibold">{signersInfo.entities.length}</span>
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
          columnHeaders={[
            { title: "Signer" },
            { title: "Stackers" },
            { title: "Stacked" },
            { title: "Rewards" },
          ]}
          rows={signersInfo.entities.map((signer: any) => [
            <>
              <div key={signer.name} className="flex">
                <img className="w-8 h-8 mr-3 mt-1" src={signer.logo} />
                <div>
                  <div className="font-semibold">{signer.name}</div>
                  <div className="text-xs">
                    {shortAddress(signer.signer_key)}
                  </div>
                </div>
              </div>
            </>,
            signer.stackers_count,
            <div key={signer.signer_key + "-stacked"}>
              <div>{`${currency.rounded.format(signer.stacked_amount)} STX`}</div>
              <div>{`$${currency.rounded.format(signer.stacked_amount_usd)}`}</div>
            </div>,
            <div key={signer.name + "-rewards"}>
              <div>{`${currency.short.format(signer.rewards_amount)} BTC`}</div>
              <div>{`$${currency.rounded.format(signer.rewards_amount_usd)}`}</div>
            </div>,
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
