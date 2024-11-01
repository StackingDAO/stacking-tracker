import React, { FC, SVGProps } from "react";

interface BitflowLogoProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const BitflowLogo: FC<BitflowLogoProps> = ({ className = "", ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <circle cx={16} cy={16} r={16} fill="#F78116" />
    <path
      fill="#0C0E0B"
      d="M21.861 10v2.397H19.72v2.012h-2.143v-2.012h-2.143V10H13.29v2.397h-2.143v2.012H9V22h2.143v-2.013h2.143v-2.396h2.143v2.396h2.142V22h2.143v-2.013h2.143v-2.396H24V10h-2.143.005Z"
    />
  </svg>
);

export default BitflowLogo;
