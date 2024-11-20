export function PoolMissing() {
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden w-full mb-6 lg:mb-0">
      <div className="md:flex md:justify-between relative">
        <div className="p-6 md:max-w-xs">
          <h4 className="font-semibold text-lg">Don&apos;t see your pool?</h4>
          <p className="text-sm text-white/70 mt-4">
            If you don&apos;t see your pool, please contact us and we will add
            your pool to the overview.
          </p>
          <a
            className="block text-center md:text-left md:inline-block mt-6 text-sm font-semibold text-orange px-4 py-3 rounded-lg bg-orange/10"
            href="https://discord.gg/bFU8JSnPP7"
          >
            Contact us
          </a>
        </div>
        <div className="md:absolute md:top-1/2 md:right-4 md:-translate-y-1/2 flex justify-center mb-6 md:mb-0 md:block">
          <svg
            width="170"
            height="122"
            viewBox="0 0 170 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M168.333 120H159.999C147.904 120 137.316 112.842 134.999 103.333C132.683 112.842 122.094 120 109.999 120C97.9044 120 87.316 112.842 84.9994 103.333C82.6827 112.842 72.0944 120 59.9994 120C47.9046 120 37.3157 112.842 34.9994 103.333C32.683 112.842 22.0941 120 9.99935 120H1.66602M143.333 2L141.125 2.73583C130.125 6.40267 124.624 8.236 121.479 12.6008C118.333 16.9656 118.333 22.7632 118.333 34.3587V118.667M76.666 2L74.4585 2.73583C63.4581 6.40267 57.9579 8.236 54.812 12.6008C51.666 16.9656 51.666 22.7632 51.666 34.3587V118.667M51.666 35.3333H118.333M51.666 68.6667H118.333M51.666 102H118.333"
              stroke="url(#paint0_linear_62_4806)"
              strokeWidth="3.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_62_4806"
                x1="168"
                y1="-6.49999"
                x2="57.4995"
                y2="171"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FC6432" />
                <stop offset="1" stopColor="#FC6432" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
