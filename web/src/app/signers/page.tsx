import { Table } from "../components/Table";
import * as api from "../common/public-api";
import { currency, shortAddress } from "@/app/common/utils";
import ChartBarStacked from "../components/ChartBarStacked";
import { ToolTip } from "../components/Tooltip";
import StxLogo from "../components/Logos/Stx";
import BtcLogo from "../components/Logos/Btc";

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
    backgroundColor: "rgba(247, 147, 26, 1)",
    borderColor: "rgba(247, 147, 26, 1)",
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
    <div className="flex flex-col w-full">
      <div className="p-4 border border-white/10 rounded-xl">
        <div className="flex items-center gap-x-2">
          <h2 className="ml-4 font-semibold text-xl">
            Cycle {lastCycleInfo.cycle_number}
          </h2>
          <span className="px-2 py-1 text-green bg-green/10 text-sm rounded-md">
            Current Cycle
          </span>
        </div>

        <div className="mt-4">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-md bg-gray">
              <dt className="text-sm font-medium leading-6 text-white/50">
                Total signers
              </dt>
              <dd className="text-lg text-white">
                {signersInfo.entities.length}
              </dd>
            </div>

            <div className="p-4 rounded-md bg-gray">
              <dt className="text-sm font-medium leading-6 text-white/50">
                Total stacked
              </dt>
              <dd className="text-lg text-white">
                <div className=" inline-flex items-center w-full text-lg font-medium leading-6 text-white gap-x-1">
                  <StxLogo className="w-[18px] h-[18px] shrink-0" />
                  {currency.rounded.format(lastCycleInfo.stacked_amount)}
                </div>
                <p className="text-sm text-white/[0.35] ">
                  ${currency.rounded.format(lastCycleInfo.stacked_amount_usd)}
                </p>
              </dd>
            </div>

            <div className="p-4 rounded-md bg-gray">
              <dt className="text-sm font-medium leading-6 text-white/50">
                <div className="flex items-center gap-1">
                  Total rewards so far
                  <ToolTip
                    id="tooltip_rewards"
                    text={
                      "Total rewards so far in this cycle. The cycle is still in progress."
                    }
                  />
                </div>
              </dt>
              <dd className="text-lg text-white">
                <div className=" inline-flex items-center w-full text-lg font-medium leading-6 text-white gap-x-1">
                  <BtcLogo className="w-[18px] h-[18px] shrink-0" />
                  {currency.short.format(lastCycleInfo.rewards_amount)}
                </div>
                <p className="text-sm text-white/[0.35] ">
                  ${currency.rounded.format(lastCycleInfo.rewards_amount_usd)}
                </p>{" "}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl mt-8">
        <div className="sm:min-h-[400px]">
          <ChartBarStacked
            chartTitles={{ x: "Cycle", y: "STX Stacked" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl mt-8">
        <div key={lastCycleInfo.cycle_number}>
          <Table
            columnHeaders={[
              { title: "Signer" },
              { title: "Stackers" },
              { title: "Stacked" },
              {
                title: "Rewards",
                info: "Total rewards so far in this cycle. The cycle is still in progress.",
              },
              { title: "" },
            ]}
            rows={signersInfo.entities.map((signer: any) => [
              <>
                <div key={signer.name} className="flex">
                  <img className="w-8 h-8 mr-3 mt-1" src={signer.logo} />
                  <div>
                    <div className="font-semibold">{signer.name}</div>
                    <div className="text-xs text-white/[0.35]">
                      {shortAddress(signer.signer_key)}
                    </div>
                  </div>
                </div>
              </>,
              signer.stackers_count,
              <div key={signer.signer_key + "-stacked"}>
                <div className="flex items-center">
                  {`${currency.rounded.format(signer.stacked_amount)}`}{" "}
                  <StxLogo className="w-3 h-3 ml-1 inline" />
                </div>
                <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(signer.stacked_amount_usd)}`}</div>
              </div>,
              <div key={signer.name + "-rewards"}>
                <div className="flex items-center">
                  {`${currency.short.format(signer.rewards_amount)}`}
                  <BtcLogo className="w-3 h-3 ml-1 inline" />
                </div>
                <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(signer.rewards_amount_usd)}`}</div>
              </div>,
              <div key={signer.slug} className="text-right">
                <a
                  key={signer.slug}
                  href={`/signers/${signer.slug ?? signer.signer_key}`}
                  className="text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                >
                  Signer Details
                </a>
              </div>,
            ])}
          />
        </div>
      </div>
    </div>
  );
}
