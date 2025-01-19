import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import StxLogo from "./Logos/Stx";
import { currency } from "../common/utils";
import { ToolTip } from "./Tooltip";

type Props = {
  liquidStxSupply: number;
  nextCycleMinThreshold: number;
  preparePhaseLength: number;
  rewardPhaseLength: number;
};

export function Info({
  liquidStxSupply,
  nextCycleMinThreshold,
  preparePhaseLength,
  rewardPhaseLength,
}: Props) {
  return (
    <div className="p-4 border border-white/10 rounded-xl shrink-0">
      <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="p-4 rounded-md bg-gray">
          <dt className="text-sm font-medium leading-6 text-white/50">
            Liquid STX Supply
          </dt>
          <dd className="inline-flex items-center w-full text-lg font-medium leading-6 text-white gap-x-1">
            <StxLogo className="w-[18px] h-[18px] shrink-0" />
            {currency.rounded.format(liquidStxSupply)}
          </dd>
        </div>
        <div className="p-4 rounded-md bg-gray">
          <dt className="text-sm font-medium leading-6 text-white/50">
            Next Cycle Min Threshold
          </dt>
          <dd className="inline-flex items-center w-full text-lg font-medium leading-6 text-white gap-x-1">
            <StxLogo className="w-[18px] h-[18px] shrink-0" />
            {currency.rounded.format(nextCycleMinThreshold)}
            <ToolTip
              id="tooltip_min_threshold"
              text={
                "This is the minimum amount of STX required to participate in the next cycle and can change over time, mainly at the end of each cycle."
              }
            />
          </dd>
        </div>
        <div className="p-4 rounded-md bg-gray">
          <dt className="text-sm font-medium leading-6 text-white/50">
            Prepare Phase Length
          </dt>
          <dd className="w-full text-lg font-medium leading-6 text-white">
            {currency.rounded.format(preparePhaseLength)} Bitcoin Blocks
          </dd>
        </div>
        <div className="p-4 rounded-md bg-gray">
          <dt className="text-sm font-medium leading-6 text-white/50">
            Reward Phase Length
          </dt>
          <dd className="w-full text-lg font-medium leading-6 text-white">
            {currency.rounded.format(rewardPhaseLength)} Bitcoin Blocks
          </dd>
        </div>
      </dl>
      <a
        href="https://www.stacks.co/learn/stacking"
        rel="noopener noreferrer"
        target="_blank"
        className="inline-flex items-center justify-center gap-x-2 text-center w-full mt-4 p-3 rounded-md bg-gray hover:bg-gray/70 focus:bg-gray-50 text-white text-sm md:text-base"
      >
        Learn more about Stacks <br className="block md:hidden" />
        Proof-of-Transfer
        <ArrowTopRightOnSquareIcon className="shrink-0 w-[14px] h-[14px] text-orange" />
      </a>
    </div>
  );
}
