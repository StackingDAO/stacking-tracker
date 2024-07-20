import { FunctionComponent } from "react";
import { Table } from "../../components/Table";
import * as api from "../../common/public-api";

type Props = {
  params: {
    signer: string;
  };
};

const Home: FunctionComponent<Props> = async ({
  params: { signer },
}: Props) => {
  const signerInfo = await api.get(`/signers/${signer}`);

  return (
    <main className="flex flex-col justify-between w-full max-w-5xl pt-12">
      {signerInfo.map((cycleInfo: any) => (
        <div key={cycleInfo.cycle_number} className="pb-12">
          <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30">
            <div className="group rounded-lg border border-transparent px-5 py-4 ">
              <h2 className="mb-3 text-2xl font-semibold">
                #{cycleInfo.cycle_number}
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">Cycle</p>
            </div>

            <div className="group rounded-lg border border-transparent px-5 py-4">
              <h2 className="mb-3 text-2xl font-semibold">
                {cycleInfo.stackers_count}
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">Stackers</p>
            </div>

            <div className="group rounded-lg border border-transparent px-5 py-4">
              <h2 className="mb-3 text-2xl font-semibold">
                {cycleInfo.stacked_amount} STX
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">Stacked</p>
            </div>
            <div className="group rounded-lg border border-transparent px-5 py-4">
              <h2 className="mb-3 text-2xl font-semibold">
                {cycleInfo.rewards_amount} BTC
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50">Rewards</p>
            </div>
          </div>

          <Table
            columnTitles={["Address", "Type", "Stacked", "Rewards"]}
            rows={cycleInfo.stackers.map((stacker: any) => [
              stacker.address,
              stacker.stacker_type,
              `${stacker.stacked_amount} STX`,
              `${stacker.rewards_amount} BTC`,
            ])}
          />
        </div>
      ))}
    </main>
  );
};

export default Home;
