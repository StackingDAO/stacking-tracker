type Props = {
  label: string;
  link: string;
};

export function ButtonWebsite({ label, link }: Props) {
  return (
    <a
      className="mt-4 md:mt-0 flex justify-center md:inline-flex items-center gap-x-1 rounded-md bg-orange/10 text-orange px-2 py-2 text-sm stroke-orange hover:bg-orange hover:text-black hover:stroke-black"
      href={link}
      target="_blank"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_89_2644)">
          <path
            d="M7.00033 12.8332C10.222 12.8332 12.8337 10.2215 12.8337 6.99984C12.8337 3.77818 10.222 1.1665 7.00033 1.1665C3.77866 1.1665 1.16699 3.77818 1.16699 6.99984C1.16699 10.2215 3.77866 12.8332 7.00033 12.8332Z"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.00033 1.1665C5.50246 2.73926 4.66699 4.82794 4.66699 6.99984C4.66699 9.17174 5.50246 11.2604 7.00033 12.8332C8.49819 11.2604 9.33366 9.17174 9.33366 6.99984C9.33366 4.82794 8.49819 2.73926 7.00033 1.1665Z"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.16699 7H12.8337"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_89_2644">
            <rect width="14" height="14" fill="white" />
          </clipPath>
        </defs>
      </svg>

      {label.replaceAll("https://www.", "").replaceAll("https://", "")}
    </a>
  );
}
