import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import StxLogo from "./Logos/Stx";

export function Info() {
  return (
    <div className="p-4 border border-white/10 rounded-xl shrink-0">
      <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="p-4 rounded-md bg-gray">
          <dt className="text-sm font-medium leading-6 text-white/50">
            Liquid STX Supply
          </dt>
          <dd className="inline-flex items-center w-full text-lg font-medium leading-6 text-white gap-x-1">
            <StxLogo className="w-[18px] h-[18px] shrink-0" />
            1,489,715,837
          </dd>
        </div>
        <div className="p-4 rounded-md bg-gray">
          <dt className="text-sm font-medium leading-6 text-white/50">
            Next Cycle Min Threshold
          </dt>
          <dd className="inline-flex items-center w-full text-lg font-medium leading-6 text-white gap-x-1">
            <StxLogo className="w-[18px] h-[18px] shrink-0" />
            100,000
          </dd>
        </div>
        <div className="p-4 rounded-md bg-gray">
          <dt className="text-sm font-medium leading-6 text-white/50">
            Prepare Phase Length
          </dt>
          <dd className="w-full text-lg font-medium leading-6 text-white">
            100 Bitcoin Blocks
          </dd>
        </div>
        <div className="p-4 rounded-md bg-gray">
          <dt className="text-sm font-medium leading-6 text-white/50">
            Reward Phase Length
          </dt>
          <dd className="w-full text-lg font-medium leading-6 text-white">
            2000 Bitcoin Blocks
          </dd>
        </div>
      </dl>
      <a
        href="https://www.stacks.co/learn/stacking"
        rel="noopener noreferrer"
        target="_blank"
        className="inline-flex items-center justify-center gap-x-2 text-center w-full mt-4 p-3 rounded-md bg-gray hover:bg-gray/80 text-white text-sm md:text-base"
      >
        Learn more about Stacks <br className="block md:hidden" />
        Proof-of-Transfer
        <ArrowTopRightOnSquareIcon className="shrink-0 w-[14px] h-[14px] text-orange" />
      </a>
    </div>
  );
}
