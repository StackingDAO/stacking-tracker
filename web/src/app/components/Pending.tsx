import { ToolTip } from "./Tooltip";

export function Pending() {
  return (
    <span className="bg-orange/[0.15] text-orange py-0.5 px-1.5 inline-flex items-center rounded-md text-sm lg:text-md">
      Pending
      <ToolTip
        id="tooltip_pending"
        text={
          "The cycle is in progress and BTC rewards are streamed to stackers on a per block basis."
        }
        className="text-orange/50 ml-1"
      ></ToolTip>
    </span>
  );
}
