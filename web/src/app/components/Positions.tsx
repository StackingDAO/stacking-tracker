"use client";
import StxLogo from "./Logos/Stx";

import { useEffect, useState } from "react";
import { useSTXAddress } from "../common/use-stx-address";
import * as api from "../common/public-api";
import { currency } from "../common/utils";
import { Table } from "./Table";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { classNames } from "../common/class-names";
import { PositionsRow } from "./PositionsRow";

export function Positions({ positions }: { positions: any }) {
  const stxAddress = useSTXAddress();

  const [hasLoaded, setHasLoaded] = useState(false);
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
    setHasLoaded(true);
  }

  useEffect(() => {
    if (stxAddress) {
      fetchUserInfo(stxAddress);
    } else {
      setUserPositions(undefined);
      setHasLoaded(true);
    }
  }, [stxAddress]);

  return (
    <div className="p-4 border border-white/10 rounded-xl mt-8">
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
                    <div>
                      {`${currency.rounded.format(position.tvl)}`}{" "}
                      <StxLogo className="w-3 h-3 ml-0.5 inline" />
                    </div>
                    <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(position.tvl_usd)}`}</div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium leading-6 text-white/50">
                    Gross APY
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
                        {position.balance > 0 ? (
                          <div className="font-semibold">
                            {`${currency.rounded.format(position.balance)}`}
                            <StxLogo className="w-3 h-3 ml-0.5 inline" />
                          </div>
                        ) : (
                          <div>
                            {`${currency.rounded.format(position.balance)}`}
                            <StxLogo className="w-3 h-3 ml-0.5 inline" />
                          </div>
                        )}

                        <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(position.balance_usd)}`}</div>
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
              <div key={position.name + "-link"} className="">
                <a
                  href={position.link}
                  className="mt-3 flex justify-center text-center text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                >
                  Start Stacking
                </a>
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
                    className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35]"
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
                    className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35] flex items-center"
                  >
                    Gross APY
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
                  .map((position: any) => (
                    <PositionsRow
                      key={position.id}
                      position={position}
                      firstChild={
                        <div className="shrink-0 rounded-lg bg-transparent mr-3 w-10 h-10 flex items-center justify-center">
                          <div className="w-1 h-[calc(100%+16px)] -mb-4 bg-orange/[0.25] " />
                        </div>
                      }
                    />
                  ))}

                {/* Other positions */}
                {getPositions()
                  .filter(
                    (position: any) =>
                      position.type !== "DeFi" && position.id !== "stackingdao"
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
  );
}
