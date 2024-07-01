// @ts-nocheck

'use client';

import { Footer } from '@/app/components/Footer';
import { WalletConnectButton } from '@/app/components/WalletConnectButton';

export function RootLayout({ signOut, children }) {
  return (
    <div className="relative flex flex-auto overflow-hidden">
      <div className="relative flex flex-col w-full isolate">
        <main className="flex flex-col flex-grow items-center pt-24">
          <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              Stacking Tracker
            </p>
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
