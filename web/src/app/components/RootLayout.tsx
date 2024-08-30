// @ts-nocheck

"use client";

import { Footer } from "@/app/components/Footer";
import { WalletConnectButton } from "@/app/components/WalletConnectButton";
import { useAppContext } from "@/app/components/AppContext";
import { currency } from "@/app/common/utils";

export function RootLayout({ signOut, children }) {
  const { stxPrice, btcPrice } = useAppContext();

  return (
    <div className="relative flex flex-auto overflow-hidden">
      <div className="relative flex flex-col w-full isolate">
        <main className="flex flex-col flex-grow items-center pt-24">
          <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
            <a
              href="/"
              className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
            >
              Stacking Tracker
            </a>
            <div className="flex gap-3 justify-center font-bold">
              <a className="underline hover:no-underline" href="/">
                PoX
              </a>{" "}
              <a className="underline hover:no-underline" href="/tokens">
                LSTs
              </a>{" "}
              <a className="underline hover:no-underline" href="/signers">
                Signers
              </a>{" "}
              <a className="underline hover:no-underline" href="/pools">
                Pools
              </a>
            </div>
            <div className="flex">
              <img className="w-5 h-5 mr-2" src="/logos/stx.webp" />
              <div>${currency.short.format(stxPrice)}</div>
              <img className="w-5 h-5 mr-2 ml-4" src="/logos/btc.webp" />
              <div>${currency.short.format(btcPrice)}</div>
            </div>
            <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
              <WalletConnectButton signOut={signOut} />
            </div>
          </div>

          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
