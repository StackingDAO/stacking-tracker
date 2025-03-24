import { ButtonLink } from "./ButtonLink";

export function StackingDao() {
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden w-full mt-6 md:mt-0">
      <div className="md:flex md:justify-between">
        <div className="p-6">
          <h4 className="font-semibold text-lg">Start Stacking Today</h4>
          <p className="text-sm text-white/60 mt-4">
            Earn the highest and most secure APY on STX with Stacking DAO, the
            hub for STX stacking.
          </p>
          <div className="mt-6">
            <a
              className="block text-center md:text-left md:inline-block text-sm font-semibold text-green px-4 py-2.5 rounded-lg bg-green/10 hover:text-black hover:bg-green focus:bg-green/70"
              href="https://www.stackingdao.com/"
              target="_blank"
            >
              Stack Now
            </a>
          </div>
        </div>
        <div className="-mb-[150px] md:-mb-[40px] md:-mt-[40px] flex justify-center md:-mr-[100px]">
          <svg
            width={300}
            height={300}
            viewBox="0 0 480 270"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M291.482 68.0145L279.85 58.9576C266.325 48.4246 249.661 42.7199 232.521 42.7199H75.946V-23H232.505C264.294 -23 295.175 -12.4055 320.255 7.10751L331.872 16.149L291.482 68.0145ZM203.904 274H101.367C69.5782 274 38.6972 263.405 13.6169 243.892L2 234.851L42.39 183.001L54.0223 192.042C67.5625 202.575 84.2263 208.296 101.382 208.296H203.919L203.904 274ZM125.91 92.6633H226.277C290.085 92.6633 342 144.544 342 208.311H276.237C276.237 180.772 253.819 158.368 226.262 158.368H125.894C62.086 158.368 10.1714 106.487 10.1714 42.7199H75.934C75.934 70.2595 98.3523 92.6633 125.91 92.6633Z"
              stroke="url(#paint0_linear_495_1275)"
              stroke-width="2.30137"
            />
            <defs>
              <linearGradient
                id="paint0_linear_495_1275"
                x1="171.997"
                y1="-86.6479"
                x2="171.997"
                y2="337.66"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#7BF178" />
                <stop offset="1" stop-color="#7BF178" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
