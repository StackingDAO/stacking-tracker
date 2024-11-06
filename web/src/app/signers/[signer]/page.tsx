import { FunctionComponent } from "react";
import { Table } from "../../components/Table";
import * as api from "../../common/public-api";
import { currency, shortAddress } from "@/app/common/utils";
import ChartBarStacked from "@/app/components/ChartBarStacked";
import StxLogo from "@/app/components/Logos/Stx";
import BtcLogo from "@/app/components/Logos/Btc";

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
              {/* @TODO: onclick copy to clipboard address */}
              <button className="w-full md:w-auto mt-4 md:mt-0 flex justify-center md:inline-flex items-center gap-x-1 rounded-md bg-orange/10 text-orange px-2 py-2 text-sm">
                {shortAddress(signerInfo.signer_key)}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_89_2661)">
                    <path
                      d="M11.667 4.6665H5.83366C5.18933 4.6665 4.66699 5.18884 4.66699 5.83317V11.6665C4.66699 12.3108 5.18933 12.8332 5.83366 12.8332H11.667C12.3113 12.8332 12.8337 12.3108 12.8337 11.6665V5.83317C12.8337 5.18884 12.3113 4.6665 11.667 4.6665Z"
                      stroke="#FC6432"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.33366 9.33317C1.69199 9.33317 1.16699 8.80817 1.16699 8.1665V2.33317C1.16699 1.6915 1.69199 1.1665 2.33366 1.1665H8.16699C8.80866 1.1665 9.33366 1.6915 9.33366 2.33317"
                      stroke="#FC6432"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_89_2661">
                      <rect width="14" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>

          <a
            className="mt-4 md:mt-0 flex justify-center md:inline-flex items-center gap-x-1 rounded-md bg-orange/10 text-orange px-2 py-2 text-sm"
            href={signerInfo.website}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_89_2644)">
                <path
                  d="M7.00033 12.8332C10.222 12.8332 12.8337 10.2215 12.8337 6.99984C12.8337 3.77818 10.222 1.1665 7.00033 1.1665C3.77866 1.1665 1.16699 3.77818 1.16699 6.99984C1.16699 10.2215 3.77866 12.8332 7.00033 12.8332Z"
                  stroke="#FC6432"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.00033 1.1665C5.50246 2.73926 4.66699 4.82794 4.66699 6.99984C4.66699 9.17174 5.50246 11.2604 7.00033 12.8332C8.49819 11.2604 9.33366 9.17174 9.33366 6.99984C9.33366 4.82794 8.49819 2.73926 7.00033 1.1665Z"
                  stroke="#FC6432"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.16699 7H12.8337"
                  stroke="#FC6432"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_89_2644">
                  <rect width="14" height="14" fill="white" />
                </clipPath>
              </defs>
            </svg>

            {signerInfo.website}
          </a>
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
        <Table
          columnHeaders={[
            { title: "Cycle" },
            { title: "Stackers" },
            { title: "Stacked" },
            { title: "Rewards" },
          ]}
          rows={signerInfo.cycles.reverse().map((info: any) => [
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
            <div
              key={info.cycle_number + "-rewards"}
              className="flex items-center"
            >
              {`${currency.short.format(info.rewards_amount)}`}
              <BtcLogo className="w-3 h-3 ml-1 inline" />
            </div>,
          ])}
        />
      </div>
    </div>
  );
};

export default Home;
