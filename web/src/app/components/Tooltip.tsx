"use client";
import { Tooltip } from "react-tooltip";
import InfoIcon from "./InfoIcon";

type Props = {
  id: string;
  text: string;
  className?: string;
};

export function ToolTip({ id, text, className }: Props) {
  return (
    <>
      <Tooltip
        id={id}
        place="top"
        className="max-w-xs text-center font-normal break-words whitespace-normal"
      >
        {text}
      </Tooltip>
      <InfoIcon className={className} data-tooltip-id={id} />
    </>
  );
}
