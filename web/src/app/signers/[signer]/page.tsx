import { FunctionComponent } from "react";
import { Table } from "../../components/Table";
import * as api from "../../common/public-api";
import { currency, generateMetaData, shortAddress } from "@/app/common/utils";
import ChartBarStacked from "@/app/components/ChartBarStacked";
import StxLogo from "@/app/components/Logos/Stx";
import BtcLogo from "@/app/components/Logos/Btc";
import { CopyAddress } from "@/app/components/CopyAddress";
import { Pending } from "@/app/components/Pending";
import { ButtonWebsite } from "@/app/components/ButtonWebsite";
import { ToolTip } from "@/app/components/Tooltip";

type Props = {
  params: {
    signer: string;
  };
};

export async function generateMetadata({ params: { signer } }: Props) {
  const signerInfo = await api.get(`/signer/${signer}`);
  const lastCycle = signerInfo.cycles[signerInfo.cycles.length - 1];
  const signerName = signerInfo.name ?? shortAddress(signerInfo.signer_key);
  const info = {
    title: `Stacking Tracker - Signer - ${signerName}`,
    description: `Signer '${signerName}' is stacking ${currency.rounded.format(lastCycle.stacked_amount)} STX in cycle ${lastCycle.cycle_number}.`,
  };
  return generateMetaData(info.title, info.description);
}

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
    data: dataRewards.slice(0, -1),
    type: "line",
    yAxisID: "yRight",
    backgroundColor: "rgba(247, 147, 26, 1)",
    borderColor: "rgba(247, 147, 26, 1)",
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

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl mb-6 lg:hidden font-semibold">Stacks Signers</h1>

      <div className="p-4 border border-white/10 rounded-xl">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-x-3 justify-center md:justify-start">
            <div className="md:flex gap-x-3 md:items-center">
              <div className="w-full mx-auto justify-center md:justify-start flex items-center gap-x-3">
                <img
                  className="w-10"
                  src={signerInfo.logo ?? "/logos/default.webp"}
                />
                <h4 className="text-xl font-medium">
                  {signerInfo.name ?? "Unknown Signer"}
                </h4>
              </div>
              <CopyAddress address={signerInfo.signer_key} />
            </div>
          </div>
          {signerInfo.website && (
            <ButtonWebsite
              label={signerInfo.website}
              link={signerInfo.website}
            />
          )}
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl mt-8">
        <div className="h-[325px] lg:min-h-[460px]">
          <ChartBarStacked
            chartTitles={{ x: "Cycle", y: "STX Stacked", yRight: "BTC Yield" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl mt-8">
        <h2 className="text-lg font-semibold mb-4">Cycles Overview</h2>

        <div className="lg:hidden">
          <div className="space-y-4 divide-y divide-white/10 [&>*:first-child]:pt-0">
            {signerInfo.cycles.reverse().map((info: any, index: number) => (
              <div key={info.cycle_number} className="pt-4">
                <dl className="grid gap-4 grid-cols-2">
                  <div key={info.cycle_number}>
                    <dt className="text-sm font-medium leading-6 text-white/50">
                      Cycle
                    </dt>
                    <dd>{info.cycle_number}</dd>
                  </div>

                  <div key={info.cycle_number + "-stacked"}>
                    <dt className="text-sm font-medium leading-6 text-white/50">
                      Stacked
                    </dt>
                    <dd>
                      <div className="flex items-center">
                        {currency.rounded.format(info.stacked_amount)}
                        <StxLogo className="w-3 h-3 ml-1 inline" />
                      </div>
                    </dd>
                  </div>

                  <div key={info.cycle_number + "-apy"}>
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
                          {currency.short.format(info.apy)}%
                          <Pending />
                        </span>
                      ) : (
                        `${currency.short.format(info.apy)}%`
                      )}
                    </dd>
                  </div>

                  <div key={info.cycle_number + "-rewards"}>
                    <dt className="text-sm font-medium leading-6 text-white/50">
                      Rewards
                    </dt>
                    <dd>
                      {index === 0 ? (
                        <span className="flex flex-col gap-1 w-fit">
                          <div className="flex items-center">
                            {info.rewards_amount.toFixed(6)}
                            <BtcLogo className="w-[12px] h-[12px] ml-1" />
                          </div>
                          <Pending />
                        </span>
                      ) : (
                        <div
                          className="flex items-center"
                          key={`rewards-${index}`}
                        >
                          {info.rewards_amount.toFixed(6)}
                          <BtcLogo className="w-[12px] h-[12px] ml-1" />
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <Table
            columnHeaders={[
              { title: "Cycle" },
              { title: "Stackers" },
              { title: "Stacked" },
              {
                title: "Gross APY",
                info: "Calculated using STX and BTC prices at the end of the cycle.",
              },
              { title: "Rewards" },
            ]}
            rows={signerInfo.cycles.map((info: any, index: number) => [
              info.cycle_number,
              info.stackers_count,
              <div
                key={info.cycle_number + "-stacked"}
                className="flex items-center"
              >
                {`${currency.rounded.format(info.stacked_amount)}`}
                <StxLogo className="w-3 h-3 ml-1 inline" />
              </div>,
              ,
              index === 0 ? (
                <span
                  key={info.cycle_number + "-apy"}
                  className="flex gap-2 items-center"
                >
                  {currency.short.format(info.apy)}%
                  <Pending />
                </span>
              ) : (
                `${currency.short.format(info.apy)}%`
              ),
              index === 0 ? (
                <div
                  key={info.cycle_number + "-rewards"}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center">
                    {`${info.rewards_amount.toFixed(6)}`}
                    <BtcLogo className="w-3 h-3 ml-1 inline" />
                  </div>
                  <Pending />
                </div>
              ) : (
                <div
                  key={info.cycle_number + "-rewards"}
                  className="flex items-center"
                >
                  {`${info.rewards_amount.toFixed(6)}`}
                  <BtcLogo className="w-3 h-3 ml-1 inline" />
                </div>
              ),
            ])}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
