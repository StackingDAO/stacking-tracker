"use client";
import StxLogo from "./Logos/Stx";

import { useEffect, useState } from "react";
import { useSTXAddress } from "../common/use-stx-address";
import * as api from "../common/public-api";
import { currency } from "../common/utils";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { classNames } from "../common/class-names";
import { PositionsRow } from "./PositionsRow";
import StStxLogo from "./Logos/StStx";
import { ButtonLink } from "./ButtonLink";
import { ToolTip } from "./Tooltip";
import { WalletInput } from "./WalletInput";
import { useAppContext } from "./AppContext";

export function Positions({ positions }: { positions: any }) {
  const [inputAddress, setInputAddress] = useState("");

  const [userPositions, setUserPositions] = useState<any | undefined>(
    undefined
  );
  const [collapsed, setCollapsed] = useState(false);

  function getPositions() {
    return userPositions ? userPositions : positions;
  }

  async function fetchUserInfo(stxAddress: string) {
    const result = await api.get(`/positions/${stxAddress}`);
    setUserPositions(result);
  }

  useEffect(() => {
    if (inputAddress) {
      setUserPositions(undefined);
      fetchUserInfo(inputAddress);
    } else {
      setUserPositions(undefined);
    }
  }, [inputAddress]);

  return (
    <div className="mt-3">
      <WalletInput onClick={(address: string) => setInputAddress(address)} />

      <div className="p-4 border border-white/10 rounded-xl mt-6">
        {/* MOBILE */}
        <div className="lg:hidden">
          <div className="space-y-4 divide-y divide-white/10 [&>*:first-child]:pt-0">
            {getPositions().map((position: any) => (
              <div key={position.name} className="pt-4">
                <div key={position.name + "-entity"}>
                  <div key={position.name} className="flex">
                    <img className="w-8 h-8 mr-3 mt-1" src={position.logo} />
                    <div className="flex flex-col">
                      <div className="font-semibold">{position.name}</div>
                      <div className="text-xs text-white/[0.35]">
                        {position.type}
                      </div>
                    </div>
                  </div>
                </div>
                <dl className="grid gap-4 grid-cols-2 mt-3">
                  <div key={position.name + "-tvl"}>
                    <dt className="text-sm font-medium leading-6 text-white/50">
                      TVL
                    </dt>
                    <dd>
                      <div className="flex items-center gap-1">
                        {`${currency.rounded.format(position.tvl)}`}{" "}
                        <StxLogo className="w-3 h-3 ml-0.5 inline" />
                      </div>
                      <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(position.tvl_usd)}`}</div>
                    </dd>
                  </div>
                  <div key={position.name + "-rewards"}>
                    <dt className="text-sm font-medium leading-6 text-white/50">
                      Rewards
                    </dt>
                    <dd>
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
                      ) : position.symbol === "LiSTX" ? (
                        <>
                          <div className="flex items-center gap-2">
                            LiSTX
                            <img
                              src="/logos/listx.webp"
                              className="w-3 h-3 inline"
                            />
                          </div>
                          <div className="text-xs text-white/[0.35]">
                            Compounding
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            STX
                            <StxLogo className="w-3 h-3 inline" />
                          </div>
                          <div className="text-xs text-white/[0.35]">
                            Manual
                          </div>
                        </>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium leading-6 text-white/50 flex gap-1 items-center">
                      Gross APY
                      <ToolTip
                        id="tooltip_apy"
                        text={
                          "Based on last 4 completed cycles, using current STX and BTC prices."
                        }
                      />
                    </dt>
                    <dd>{currency.short.format(position.apy)}%</dd>
                  </div>
                  {userPositions && (
                    <div key={position.name + "-balance"}>
                      <dt className="text-sm font-medium leading-6 text-white/50">
                        Balance
                      </dt>
                      <dd>
                        <div>
                          <div
                            className={classNames(
                              "flex items-center gap-1",
                              position.balance > 0
                                ? "font-semibold"
                                : "font-normal"
                            )}
                          >
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

                          <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(position.balance_usd)}`}</div>
                        </div>
                      </dd>
                    </div>
                  )}
                </dl>
                <div key={position.name + "-link"} className="mt-4">
                  <ButtonLink
                    label="Start Stacking"
                    link={position.link}
                    target="_blank"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="[&>*:first-child]:rounded-l-md [&>*:first-child]:pl-4 [&>*:last-child]:rounded-r-md">
                    <th
                      scope="col"
                      className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35] w-[350px]"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35]"
                    >
                      TVL
                    </th>
                    <th
                      scope="col"
                      className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35]"
                    >
                      Rewards
                    </th>
                    <th
                      scope="col"
                      className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35] flex gap-1 items-center"
                    >
                      Gross APY
                      <ToolTip
                        id="tooltip_apy"
                        text={
                          "Based on last 4 completed cycles, using current STX and BTC prices."
                        }
                      />
                    </th>
                    {userPositions && (
                      <th
                        scope="col"
                        className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35]"
                      >
                        Balance
                      </th>
                    )}
                    <th
                      scope="col"
                      className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35]"
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {/* StackingDAO group */}
                  {getPositions()
                    .filter((position: any) => position.id === "stackingdao")
                    .map((position: any) => (
                      <PositionsRow
                        key={position.id}
                        position={position}
                        firstChild={
                          <button
                            type="button"
                            className="shrink-0 rounded-lg bg-orange/10 mr-3 w-10 h-10 flex items-center justify-center"
                            onClick={() => setCollapsed(!collapsed)}
                          >
                            <ChevronDownIcon
                              className={classNames(
                                "w-5 h-5 text-orange",
                                collapsed ? "" : "rotate-180"
                              )}
                            />
                          </button>
                        }
                      />
                    ))}

                  {/* StackingDAO group elements */}
                  {getPositions()
                    .filter(
                      (position: any) => !collapsed && position.type === "DeFi"
                    )
                    .map((position: any, index: number) => (
                      <PositionsRow
                        key={position.id}
                        position={position}
                        firstChild={
                          <div className="shrink-0 rounded-lg bg-transparent mr-3 w-10 h-10 flex items-center justify-center">
                            <div className="w-1 h-[calc(100%+32px)] bg-orange/[0.25]" />
                          </div>
                        }
                      />
                    ))}

                  {/* Other positions */}
                  {getPositions()
                    .filter(
                      (position: any) =>
                        position.type !== "DeFi" &&
                        position.id !== "stackingdao"
                    )
                    .map((position: any) => (
                      <PositionsRow key={position.id} position={position} />
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
