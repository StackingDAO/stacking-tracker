import React, { FC, SVGProps } from "react";

interface InfoIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const InfoIcon: FC<InfoIconProps> = ({ className = "", ...props }) => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.167}
      d="M5.303 5.25a1.75 1.75 0 0 1 3.4.583c0 1.167-1.75 1.75-1.75 1.75M7 9.917h.006M7 12.833A5.833 5.833 0 1 0 7 1.167a5.833 5.833 0 0 0 0 11.666Z"
    />
  </svg>
);

export default InfoIcon;
