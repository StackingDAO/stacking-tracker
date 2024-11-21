import { currency } from "../common/utils";
import StxLogo from "./Logos/Stx";

type Position = {
  apy: number;
  balance: number;
  balance_usd: number;
  id: string;
  link: string;
  logo: string;
  name: string;
  symbol: string;
  tvl: number;
  tvl_usd: number;
  type: string;
};

type Props = {
  firstChild?: React.ReactNode;
  position: Position;
};

export function PositionsRow({ firstChild, position }: Props) {
  const showBalance = "balance" in position;
  return (
    <tr key={position.id}>
      <td colSpan={showBalance ? 5 : 4}>
        <table className="w-full table-fixed">
          <tbody>
            <tr className="[&>*:first-child]:pl-4">
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                <div>
                  <div className="flex items-center">
                    {firstChild}

                    <img className="w-8 h-8 mr-3 mt-1" src={position.logo} />
                    <div className="flex flex-col">
                      <div className="font-semibold">{position.name}</div>
                      <div className="text-xs text-white/[0.35]">
                        {position.type}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                <div>
                  <div>
                    {`${currency.rounded.format(position.tvl)}`}
                    <StxLogo className="w-3 h-3 ml-0.5 inline" />
                  </div>
                  <div className="text-xs text-white/[0.35]">
                    ${`${currency.rounded.format(position.tvl_usd)}`}
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                {`${currency.short.format(position.apy)}`}%
              </td>
              {showBalance && (
                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                  <div>
                    <div className="font-semibold">
                      {`${currency.rounded.format(position.balance)}`}
                      <StxLogo className="w-3 h-3 ml-0.5 inline" />
                    </div>
                    <div className="text-xs text-white/[0.35]">
                      ${`${currency.rounded.format(position.balance_usd)}`}
                    </div>
                  </div>
                </td>
              )}

              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                <div className="text-right">
                  <a
                    href={position.link}
                    className="text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                  >
                    Start Stacking
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}