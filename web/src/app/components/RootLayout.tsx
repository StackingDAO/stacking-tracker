// @ts-nocheck

'use client';

import { Footer } from '@/app/components/Footer';

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
              <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-gray-100 p-4">
                  Connect Wallet
                </button>
              </a>
            </div>
          </div>

          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
