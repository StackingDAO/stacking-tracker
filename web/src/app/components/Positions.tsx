"use client";
import StStxLogo from "./Logos/StStx";

import { useEffect, useState } from "react";
import { useSTXAddress } from "../common/use-stx-address";
import * as api from "../common/public-api";
import { currency } from "../common/utils";
import { Table } from "./Table";

export function Positions({ positions }: { positions: any }) {
  const stxAddress = useSTXAddress();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [userPositions, setUserPositions] = useState<any | undefined>(
    undefined
  );

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
      {userPositions ? (
        <>
          <div className="lg:hidden">
            <div className="space-y-4 divide-y divide-white/10 [&>*:first-child]:pt-0">
              {userPositions.map((position: any) => (
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
                  <dl className="grid gap-4 grid-cols-3 mt-3">
                    <div key={position.name + "-tvl"}>
                      <dt className="text-sm font-medium leading-6 text-white/50">
                        TVL
                      </dt>
                      <dd>
                        <div>
                          {`${currency.rounded.format(position.tvl)}`}{" "}
                          <StStxLogo className="w-3 h-3 ml-0.5 inline" />
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
                    <div key={position.name + "-balance"}>
                      <dt className="text-sm font-medium leading-6 text-white/50">
                        Balance
                      </dt>
                      <dd>
                        <div>
                          {position.balance > 0 ? (
                            <div className="font-semibold">
                              {`${currency.rounded.format(position.balance)}`}
                              <StStxLogo className="w-3 h-3 ml-0.5 inline" />
                            </div>
                          ) : (
                            <div>
                              {`${currency.rounded.format(position.balance)}`}
                              <StStxLogo className="w-3 h-3 ml-0.5 inline" />
                            </div>
                          )}

                          <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(position.balance_usd)}`}</div>
                        </div>
                      </dd>
                    </div>
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

          <div className="hidden lg:block">
            <Table
              columnHeaders={[
                { title: "Position" },
                { title: "TVL" },
                {
                  title: "Gross APY",
                  info: "Based on last 4 cycles and current prices. Not taking into account fees.",
                },
                { title: "Balance" },
                { title: "" },
              ]}
              rows={userPositions.map((position: any) => [
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
                </div>,
                <div key={position.name + "-tvl"}>
                  <div>
                    {`${currency.rounded.format(position.tvl)}`}{" "}
                    <StStxLogo className="w-3 h-3 ml-0.5 inline" />
                  </div>
                  <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(position.tvl_usd)}`}</div>
                </div>,
                `${currency.short.format(position.apy)}%`,
                <div key={position.name + "-balance"}>
                  {position.balance > 0 ? (
                    <div className="font-semibold">
                      {`${currency.rounded.format(position.balance)}`}
                      <StStxLogo className="w-3 h-3 ml-0.5 inline" />
                    </div>
                  ) : (
                    <div>
                      {`${currency.rounded.format(position.balance)}`}
                      <StStxLogo className="w-3 h-3 ml-0.5 inline" />
                    </div>
                  )}

                  <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(position.balance_usd)}`}</div>
                </div>,
                <div key={position.name + "-link"} className="text-right">
                  <a
                    href={position.link}
                    className="text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                  >
                    Start Stacking
                  </a>
                </div>,
              ])}
            />
          </div>
        </>
      ) : (
        <>
          <div className="lg:hidden">
            <div className="space-y-4 divide-y divide-white/10 [&>*:first-child]:pt-0">
              {positions.map((position: any) => (
                <div key={position.name} className="pt-4">
                  <div key={position.name + "-entity"}>
                    <div className="flex">
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
                          <StStxLogo className="w-3 h-3 ml-0.5 inline" />
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
                  </dl>
                  <div key={position.name + "-link"}>
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
          <div className="hidden lg:block">
            <Table
              columnHeaders={[
                { title: "Position" },
                { title: "TVL" },
                {
                  title: "Gross APY",
                  info: "Based on last 4 cycles and current prices. Not taking into account fees.",
                },
                { title: "" },
              ]}
              rows={positions.map((position: any) => [
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
                </div>,
                <div key={position.name + "-tvl"}>
                  <div>
                    {`${currency.rounded.format(position.tvl)}`}{" "}
                    <StStxLogo className="w-3 h-3 ml-0.5 inline" />
                  </div>
                  <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(position.tvl_usd)}`}</div>
                </div>,
                `${currency.short.format(position.apy)}%`,
                <div key={position.name + "-link"} className="text-right">
                  <a
                    href={position.link}
                    className="text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                  >
                    Start Stacking
                  </a>
                </div>,
              ])}
            />
          </div>
        </>
      )}
    </div>
  );
}
