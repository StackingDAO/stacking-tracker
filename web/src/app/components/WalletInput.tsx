"use client";

import { useState } from "react";

type Props = {
  state: string;
  onClick: (address: string) => void;
};

export function WalletInput({ state, onClick }: Props) {
  const [inputAddress, setInputAddress] = useState("");

  return (
    <div className="p-4 border border-white/10 rounded-xl">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center gap-x-4">
          <div className="w-10 h-10 bg-orange/10 relative flex items-center justify-center rounded-lg">
            <div className="w-2 h-2 bg-[#7BF178] rounded-full absolute right-0 top-0 -mt-0.5 -mr-0.5" />
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
          <p className="text-white text-sm">
            Enter a wallet to view the positions
          </p>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-6/12 flex">
          <input
            value={inputAddress}
            onChange={(event) => setInputAddress(event.target.value)}
            className="w-full text-sm font-semibold text-white bg-black border border-white/10 px-4 py-2 rounded-lg"
          />

          {state === "default" || state === "loading" ? (
            <button
              onClick={() => onClick(inputAddress)}
              type="button"
              className="w-auto text-sm font-semibold leading-6 text-black px-4 py-2 rounded-lg bg-orange ml-2 disabled:opacity-50"
              disabled={state === "loading"}
            >
              View
            </button>
          ) : state === "user" ? (
            <button
              onClick={() => {
                setInputAddress("");
                onClick("");
              }}
              type="button"
              className="w-auto text-sm font-semibold leading-6 text-black px-4 py-2 rounded-lg bg-orange ml-2"
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
