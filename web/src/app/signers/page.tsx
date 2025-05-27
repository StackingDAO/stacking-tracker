import { Table } from "../components/Table";
import * as api from "../common/public-api";
import { currency, generateMetaData, shortAddress } from "@/app/common/utils";
import ChartBarStacked from "../components/ChartBarStacked";
import { ToolTip } from "../components/Tooltip";
import StxLogo from "../components/Logos/Stx";
import BtcLogo from "../components/Logos/Btc";
import { ButtonLink } from "../components/ButtonLink";

export async function generateMetadata() {
  const signersInfo = await api.get("/signers");
  const lastCycle = signersInfo.cycles[signersInfo.cycles.length - 1];
  const info = {
    title: `Stacking Tracker - Signers`,
    description: `All your data needs on signers on Stacks! There are ${signersInfo.entities.length} signers active in cycle ${lastCycle.cycle_number}.`,
  };
  return generateMetaData(info.title, info.description);
}

export default async function Home() {
  const signersInfo = await api.get("/signers");

  const lastCycleInfo = signersInfo.cycles[signersInfo.cycles.length - 1];
  const chartLabels = signersInfo.cycles.map((info: any) => info.cycle_number);
  const activeSigners = lastCycleInfo.signers;
  const datasets: any[] = [];

  datasets.push({
    label: "BTC Yield",
    data: signersInfo.cycles.map(
      (info: any) => info.extrapolated_rewards_amount || info.rewards_amount
    ),
    type: "line",
    yAxisID: "yRight",
    backgroundColor: "rgba(247, 147, 26, 1)",
    borderColor: "rgba(247, 147, 26, 1)",
    highlightLastSegment: true,
  });

  const colors: { [key: string]: string } = {
    "Fast Pool": "#367576",
    Planbetter: "#6C8E22",
    StackingDAO: "#80341B",
    "Xverse #1": "#9B4069",
    "Xverse #2": "#9B4069",
    "Xverse #3": "#9B4069",
    "Kiln #1": "#5E3A7A",
    "Kiln #2": "#5E3A7A",
  };

  for (const activeSigner of activeSigners) {
    const data: any[] = [];
    for (const cycleInfo of signersInfo.cycles) {
      const signerInfo = cycleInfo.signers.filter(
        (signer: any) => signer.name === activeSigner.name
      )[0];

      data.push(signerInfo ? signerInfo.stacked_amount : 0);
    }

    datasets.push({
      label: activeSigner.name,
      data: data,
      backgroundColor: colors[activeSigner.name] ?? "#2E7D59",
    });
  }

  const chartData = {
    labels: chartLabels,
    datasets: datasets,
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl mb-6 lg:hidden font-semibold">Stacks Signers</h1>

      <div className="p-4 border border-white/10 rounded-xl">
        <div className="flex items-center justify-between mb-4">
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
                Total Signers
              </dt>
              <dd className="text-lg text-white">
                {signersInfo.entities.length}
              </dd>
            </div>

            <div className="p-4 rounded-md bg-gray">
              <dt className="text-sm font-medium leading-6 text-white/50">
                Total Stacked
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
                  Total Rewards So Far
                  <ToolTip
                    id="tooltip_rewards"
                    text={
                      "The cycle is in progress and BTC Rewards are streamed to stackers on a per block basis"
                    }
                  />
                </div>
              </dt>
              <dd className="text-lg text-white">
                <div className=" inline-flex items-center w-full text-lg font-medium leading-6 text-white gap-x-1">
                  <BtcLogo className="w-[18px] h-[18px] shrink-0" />
                  {lastCycleInfo.rewards_amount.toFixed(6)}
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
        <div className="h-[325px] lg:min-h-[460px]">
          <ChartBarStacked
            chartTitles={{ x: "Cycle", y: "STX Stacked" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl mt-8">
        <div className="lg:hidden">
          <div className="space-y-4 divide-y divide-white/10 [&>*:first-child]:pt-0">
            {signersInfo.entities.map((signer: any) => (
              <div key={signer.slug} className="pt-4">
                <dl className="grid gap-4 grid-cols-2">
                  <div key={signer.name}>
                    <dt className="text-sm font-medium leading-6 text-white/50">
                      Signer
                    </dt>
                    <dd>
                      <div className="flex items-center">
                        <img className="w-5 mr-2" src={signer.logo} />
                        <div className="font-semibold">
                          {shortAddress(signer.name)}
                        </div>
                      </div>
                    </dd>
                  </div>
                  <div></div>
                  <div key={signer.name + "-stacked"}>
                    <dt className="text-sm font-medium leading-6 text-white/50">
                      Stacked
                    </dt>
                    <div className="flex items-center">
                      {currency.rounded.format(signer.stacked_amount)}
                      <StxLogo className="w-3 h-3 ml-1 inline" />
                    </div>
                    <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(signer.stacked_amount_usd)}`}</div>
                  </div>
                  <div key={signer.name + "-rewards"}>
                    <dt className="text-sm font-medium leading-6 text-white/50 flex gap-1 items-center">
                      BTC Rewards So Far
                      <ToolTip
                        id="tooltip_rewards"
                        text="The cycle is in progress and BTC Rewards are streamed to stackers on a per block basis."
                      />
                    </dt>
                    <dd>
                      <div className="flex items-center">
                        {`${signer.rewards_amount.toFixed(6)}`}
                        <BtcLogo className="w-3 h-3 ml-1 inline" />
                      </div>
                      <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(signer.rewards_amount_usd)}`}</div>
                    </dd>
                  </div>
                </dl>
                <div key={signer.slug} className="mt-4">
                  <ButtonLink
                    label="View Signer History"
                    link={`/signers/${signer.slug ?? signer.signer_key}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block" key={lastCycleInfo.cycle_number}>
          <Table
            columnHeaders={[
              { title: "Signer" },
              { title: "Stacked" },
              {
                title: "BTC Rewards So Far",
                info: "The cycle is in progress and BTC Rewards are streamed to stackers on a per block basis",
              },
              { title: "" },
            ]}
            rows={signersInfo.entities.map((signer: any) => [
              <div key={signer.name} className="flex items-center">
                <img className="w-5 mr-2" src={signer.logo} />
                <div className="font-semibold">{shortAddress(signer.name)}</div>
              </div>,
              <div key={signer.name + "-stacked"}>
                <div className="flex items-center">
                  {`${currency.rounded.format(signer.stacked_amount)}`}{" "}
                  <StxLogo className="w-3 h-3 ml-1 inline" />
                </div>
                <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(signer.stacked_amount_usd)}`}</div>
              </div>,
              <div key={signer.name + "-rewards"}>
                <div className="flex items-center">
                  {`${signer.rewards_amount.toFixed(6)}`}
                  <BtcLogo className="w-3 h-3 ml-1 inline" />
                </div>
                <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(signer.rewards_amount_usd)}`}</div>
              </div>,
              <div key={signer.slug} className="text-right">
                <ButtonLink
                  label="View Signer History"
                  link={`/signers/${signer.slug ?? signer.signer_key}`}
                />
              </div>,
            ])}
          />
        </div>
      </div>
    </div>
  );
}
