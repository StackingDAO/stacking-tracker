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
      setHasLoaded(true);
    }
  }, [stxAddress]);

  return (
    <div className="p-4 border border-white/10 rounded-xl mt-8">
      {userPositions ? (
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
                  {`${currency.rounded.format(position.balance)}`}{" "}
                  <StStxLogo className="w-3 h-3 ml-0.5 inline" />
                </div>
              ) : (
                <div>
                  {`${currency.rounded.format(position.balance)}`}{" "}
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
      ) : (
        <>
          {hasLoaded && (
            <div className="rounded-lg border border-gray-200 bg-blue-400 text-white font-semibold p-4 mb-2">
              Connect your wallet to view your balances
            </div>
          )}

          <Table
            columnHeaders={[
              { title: "Position" },
              { title: "TVL" },
              {
                title: "Gross APY",
                info: "Based on last 4 cycles and current prices. Not taking into account fees.",
              },
            ]}
            rows={positions.map((position: any) => [
              <div key={position.name + "-entity"}>
                <div key={position.name} className="flex">
                  <img className="w-8 h-8 mr-3 mt-1" src={position.logo} />
                  <div className="flex flex-col">
                    <div className="font-semibold">{position.name}</div>
                    <div className="text-xs">{position.type}</div>
                  </div>
                </div>
              </div>,
              <div key={position.name + "-tvl"}>
                <div>{`${currency.rounded.format(position.tvl)} ${position.symbol}`}</div>
                <div className="text-xs">{`$${currency.rounded.format(position.tvl_usd)}`}</div>
              </div>,
              `${currency.short.format(position.apy)}%`,
              <a
                key={position.name + "-link"}
                href={position.link}
                className="underline hover:no-underline"
              >
                Start Stacking
              </a>,
            ])}
          />
        </>
      )}
    </div>
  );
}
