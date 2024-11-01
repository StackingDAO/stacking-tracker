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
      ) : (
        <div className="md:flex md:flex-col md:items-center md:justify-center md:py-32 py-16">
          <div className="w-10 h-10 bg-orange/10 relative flex items-center justify-center rounded-lg mx-auto">
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.3335 11.6667C13.3335 12.3571 13.8932 12.9167 14.5835 12.9167C15.2738 12.9167 15.8335 12.3571 15.8335 11.6667C15.8335 10.9764 15.2738 10.4167 14.5835 10.4167C13.8932 10.4167 13.3335 10.9764 13.3335 11.6667Z"
                stroke="#FC6432"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.33317 5.83333H13.3332C15.6902 5.83333 16.8687 5.83333 17.6009 6.56557C18.3332 7.2978 18.3332 8.47633 18.3332 10.8333V12.5C18.3332 14.857 18.3332 16.0355 17.6009 16.7677C16.8687 17.5 15.6902 17.5 13.3332 17.5H8.33317C5.19047 17.5 3.61913 17.5 2.64281 16.5237C1.6665 15.5474 1.6665 13.976 1.6665 10.8333V9.16667C1.6665 6.02397 1.6665 4.45262 2.64281 3.47631C3.61913 2.5 5.19047 2.5 8.33317 2.5H11.6665C12.4415 2.5 12.829 2.5 13.1469 2.58518C14.0096 2.81635 14.6835 3.49022 14.9147 4.35295C14.9998 4.67087 14.9998 5.05836 14.9998 5.83333"
                stroke="#FC6432"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="mt-4">
            <h4 className="text-center text-xl font-semibold">
              Connect your wallet
              <br />
              to view your positions
            </h4>
          </div>

          <div className="mt-6">
            {/* @TODO: trigger wallet flow */}
            <button
              type="button"
              className="w-full md:w-auto text-sm font-semibold leading-6 text-black px-4 py-2 rounded-lg bg-orange"
            >
              Connect wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
