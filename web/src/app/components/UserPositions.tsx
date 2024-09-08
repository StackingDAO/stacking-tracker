"use client";

import { useEffect, useState } from "react";
import { useSTXAddress } from "../common/use-stx-address";
import * as api from "../common/public-api";
import { currency } from "../common/utils";

export function UserPositions() {
  const stxAddress = useSTXAddress();

  const [userInfo, setUserInfo] = useState<any | undefined>();

  async function fetchUserInfo(stxAddress: string) {
    const result = await api.get(`/user/${stxAddress}`);
    setUserInfo(result);
  }

  useEffect(() => {
    if (stxAddress) {
      fetchUserInfo(stxAddress);
    }
  }, [stxAddress]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-2">
      {!stxAddress ? (
        <>Connect your wallet to view your positions.</>
      ) : (
        <>
          Connected: {stxAddress}
          <div className="grid grid-cols-4 gap-5 pt-3">
            {userInfo?.positions &&
              userInfo.positions.map((position: any) => (
                <div
                  key={position.name}
                  className="border-2 border-gray-200 rounded-md p-2"
                >
                  <img
                    className="w-10 mr-2 pb-4"
                    src={position.logo ?? "/logos/default.webp"}
                  />
                  <div>
                    <span className="font-semibold">{position.name}</span>
                  </div>
                  {position.type === "direct_stacking" ? (
                    <>
                      <div>
                        Delegated:{" "}
                        <span className="font-semibold">
                          {currency.short.format(position.delegated)}{" "}
                          {position.symbol}
                        </span>
                        {position.delegated_usd ? (
                          <>
                            {" "}
                            (${currency.short.format(position.delegated_usd)})
                          </>
                        ) : null}
                      </div>
                      <div>
                        Stacked:{" "}
                        <span className="font-semibold">
                          {currency.short.format(position.balance)}{" "}
                          {position.symbol}
                        </span>
                        {position.balance_usd ? (
                          <> (${currency.short.format(position.balance_usd)})</>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <div>
                      Balance:{" "}
                      <span className="font-semibold">
                        {currency.short.format(position.balance)}{" "}
                        {position.symbol}
                      </span>
                      {position.balance_usd ? (
                        <> (${currency.short.format(position.balance_usd)})</>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
