import { FunctionComponent } from "react";
import { Table } from "../../components/Table";
import * as api from "../../common/public-api";
import { currency } from "@/app/common/utils";
import ChartBarStacked from "@/app/components/ChartBarStacked";
import StxLogo from "@/app/components/Logos/Stx";
import BtcLogo from "@/app/components/Logos/Btc";
import { Pending } from "@/app/components/Pending";

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
    borderRadius: 6,
    borderSkipped: false,
  });

  const chartData = {
    labels: chartLabels,
    datasets: datasets,
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl mb-6 lg:hidden font-semibold">Stacking Pools</h1>

      <div className="p-4 border border-white/10 rounded-xl">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center gap-x-3 justify-center md:justify-start">
            <img className="w-10" src={poolInfo.logo} />
            <h4 className="font-semibold">{poolInfo.name}</h4>
          </div>
          <a
            className="mt-4 md:mt-0 flex justify-center md:inline-flex items-center gap-x-1 rounded-md bg-orange/10 text-orange px-2 py-2 text-sm"
            href={poolInfo.website}
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

            {poolInfo.website}
          </a>
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl mt-8">
        <div className="h-[325px] lg:min-h-[400px]">
          <ChartBarStacked
            chartTitles={{ x: "Cycle", y: "STX Stacked", yRight: "BTC Yield" }}
            chartData={chartData}
          />
        </div>
      </div>

      <div className="p-4 border border-white/10 rounded-xl mt-8">
        <h2 className="text-lg font-semibold mb-4">Cycles overview</h2>

        <div className="lg:hidden">
          <div className="space-y-4 divide-y divide-white/10 [&>*:first-child]:pt-0">
            {poolInfo.cycles.reverse().map((info: any, index: number) => (
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
                        {`${currency.rounded.format(info.stacked_amount)}`}
                        <StxLogo className="w-3 h-3 ml-1 inline" />
                      </div>
                    </dd>
                  </div>
                  <div key={info.cycle_number + "-apy"}>
                    <dt className="text-sm font-medium leading-6 text-white/50">
                      APY
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
                      BTC rewards so far
                    </dt>
                    <dd>
                      {index === 0 ? (
                        <span className="flex flex-col gap-1 w-fit">
                          <div className="flex items-center">
                            {currency.short.format(info.rewards_amount)}
                            <BtcLogo className="w-[12px] h-[12px] ml-1" />
                          </div>
                          <Pending />
                        </span>
                      ) : (
                        <div
                          className="flex items-center"
                          key={`rewards-${index}`}
                        >
                          {currency.short.format(info.rewards_amount)}
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
              { title: "Stacked" },
              { title: "Gross APY" },
              { title: "Rewards" },
            ]}
            rows={poolInfo.cycles.map((info: any, index: number) => [
              info.cycle_number,
              <div
                key={info.cycle_number + "-stacked"}
                className="flex items-center"
              >
                {`${currency.rounded.format(info.stacked_amount)}`}
                <StxLogo className="w-3 h-3 ml-1 inline" />
              </div>,
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
                    {`${currency.short.format(info.rewards_amount)}`}
                    <BtcLogo className="w-3 h-3 ml-1 inline" />
                  </div>
                  <Pending />
                </div>
              ) : (
                <div
                  key={info.cycle_number + "-rewards"}
                  className="flex items-center"
                >
                  {`${currency.short.format(info.rewards_amount)}`}
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
