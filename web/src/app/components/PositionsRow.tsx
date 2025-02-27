import { currency } from "../common/utils";
import { ButtonLink } from "./ButtonLink";
import StStxLogo from "./Logos/StStx";
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
      <td colSpan={showBalance ? 6 : 5}>
        <table className="w-full table-fixed">
          <tbody>
            <tr>
              <td className="my-2 pl-6 text-sm text-gray-500 sm:pl-0 pr-12 w-[350px]">
                <div>
                  <div className="flex items-center">
                    {firstChild}
                    <img
                      className="w-10 h-10 mr-3 mt-1"
                      alt=""
                      src={position.logo}
                    />
                    <div className="flex flex-col py-4">
                      {position.type === "LST" &&
                      position.name === "StackingDAO" ? (
                        <div className="font-semibold">
                          {position.name} {position.symbol}
                        </div>
                      ) : (
                        <div className="font-semibold">{position.name}</div>
                      )}
                      <div className="text-xs text-white/[0.35]">
                        {position.type}
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap my-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                <div>
                  <div className="flex items-center gap-2">
                    {`${currency.rounded.format(position.tvl)}`}
                    <StxLogo className="w-3 h-3 inline" />
                  </div>
                  <div className="text-xs text-white/[0.35]">
                    ${`${currency.rounded.format(position.tvl_usd)}`}
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                <div>
                  {position.symbol === "stSTX" ? (
                    <>
                      <div className="flex items-center gap-2">
                        stSTX
                        <StStxLogo className="w-3 h-3 inline" />
                      </div>
                      <div className="text-xs text-white/[0.35]">
                        Compounding
                      </div>
                    </>
                  ) : position.symbol === "stSTXbtc" ? (
                    <>
                      <div className="flex items-center gap-2">
                        sBTC
                        <img
                          src="/logos/sbtc.webp"
                          className="w-3 h-3 inline"
                        />
                      </div>
                      <div className="text-xs text-white/[0.35]">Manual</div>
                    </>
                  ) : position.symbol === "BTC" ? (
                    <>
                      <div className="flex items-center gap-2">
                        BTC
                        <img src="/logos/btc.webp" className="w-3 h-3 inline" />
                      </div>
                      <div className="text-xs text-white/[0.35]">Manual</div>
                    </>
                  ) : position.symbol === "LiSTX" ? (
                    <>
                      <div className="flex items-center gap-2">
                        LiSTX
                        <img
                          src="/logos/listx.webp"
                          className="w-3 h-3 inline"
                        />
                      </div>
                      <div className="text-xs text-white/[0.35]">Manual</div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        STX
                        <StxLogo className="w-3 h-3 inline" />
                      </div>
                      <div className="text-xs text-white/[0.35]">Manual</div>
                    </>
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                {`${position.apy ? currency.short.format(position.apy) + "%" : "TBD"}`}
              </td>
              {showBalance && (
                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {`${currency.rounded.format(position.balance)}`}
                      {position.symbol === "stSTX" ? (
                        <StStxLogo className="w-3 h-3 inline" />
                      ) : position.symbol === "LiSTX" ? (
                        <img
                          src="/logos/listx.webp"
                          className="w-3 h-3 inline"
                        />
                      ) : (
                        <StxLogo className="w-3 h-3 inline" />
                      )}
                    </div>
                    <div className="text-xs text-white/[0.35]">
                      ${`${currency.rounded.format(position.balance_usd)}`}
                    </div>
                  </div>
                </td>
              )}

              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                <div className="text-right">
                  <ButtonLink
                    label="Start Stacking"
                    link={position.link}
                    target="_blank"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
