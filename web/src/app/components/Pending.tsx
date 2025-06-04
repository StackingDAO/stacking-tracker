import { ToolTip } from "./Tooltip";

interface PendingProps {
  iconOnly?: boolean;
  highlightTooltip?: boolean;
}

export function Pending({
  iconOnly = false,
  highlightTooltip = true,
}: PendingProps) {
  const tooltipClass = `${highlightTooltip ? "text-orange/50" : "text-white/50"} ml-1`;

  return (
    <>
      {iconOnly ? (
        <ToolTip
          id="tooltip_pending"
          text="The cycle is in progress and BTC rewards are streamed to stackers on a per block basis."
          className={tooltipClass}
        />
      ) : (
        <span className="bg-orange/[0.15] text-orange py-0.5 px-1.5 inline-flex items-center rounded-md text-sm lg:text-md">
          Pending
          <ToolTip
            id="tooltip_pending"
            text="The cycle is in progress and BTC rewards are streamed to stackers on a per block basis."
            className={tooltipClass}
          />
        </span>
      )}
    </>
  );
}
