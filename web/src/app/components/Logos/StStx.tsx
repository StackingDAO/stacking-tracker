import React, { FC, SVGProps } from 'react';

interface StStxLogoProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const StStxLogo: FC<StStxLogoProps> = ({ className = '', ...props }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <circle cx="10" cy="10" r="10" fill="#1C3830" />
    <path
      d="M11.9841 11.8973L14.1515 15.2812H12.5323L9.98797 11.3054L7.44361 15.2812H5.83304L8.00046 11.9061H4.89069V10.625H15.0938V11.8973H11.9841Z"
      fill="#7BF178"
    />
    <path
      d="M15.1407 8.07765V9.36612V9.375H4.89072V8.07765H7.95453L5.80297 4.71875H7.42956L10.0114 8.77075L12.6019 4.71875H14.2285L12.0769 8.07765H15.1407Z"
      fill="#7BF178"
    />
  </svg>
);

export default StStxLogo;
