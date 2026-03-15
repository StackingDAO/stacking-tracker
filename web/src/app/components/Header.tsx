"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/app/components/AppContext";
import Link from "next/link";

import { currency } from "@/app/common/utils";
import StxLogo from "./Logos/Stx";
import BtcLogo from "./Logos/Btc";
import { classNames } from "../common/class-names";
import { WalletConnectButton } from "./WalletConnectButton";

const navigation = [
  { name: "Stacking Overview", href: "/" },
  { name: "Positions", href: "/positions" },
  { name: "LSTs", href: "/tokens" },
  { name: "Stacking Pools", href: "/pools" },
  { name: "Stacks Signers", href: "/signers" },
];

export function Header({ signOut }: { signOut: () => void }) {
  const { stxPrice, btcPrice } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header>
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-6xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex items-center gap-x-6">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Stacking Tracker</span>
            <div className="w-10 h-10 bg-orange rounded-full" />
          </a>
          <div className="hidden lg:flex lg:gap-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  "text-sm font-semibold leading-6 px-3 py-3 rounded-lg hover:bg-orange/[0.05]",
                  pathname === item.href || pathname.includes(item.href + "/")
                    ? "bg-orange/10 text-orange"
                    : "text-white/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-x-4 lg:hidden">
          <div className="flex gap-x-2">
            <div className="px-4 py-3 border border-white/10 rounded-lg flex items-center gap-1">
              <StxLogo className="w-[14px] h-[14px] shrink-0" />
              <p className="text-sm">
                ${currency.short.format(Number(stxPrice))}
              </p>
            </div>
            <div className="px-4 py-3 border border-white/10 rounded-lg flex items-center gap-1">
              <BtcLogo className="w-[14px] h-[14px] shrink-0" />
              <p className="text-sm">
                ${currency.short.format(Number(btcPrice))}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6 text-orange" />
          </button>
        </div>
        <div className="hidden lg:flex">
          <div className="flex gap-x-4">
            <div className="px-4 py-3 border border-white/10 rounded-lg flex items-center gap-1">
              <StxLogo className="w-[14px] h-[14px] shrink-0" />
              <p className="text-sm">
                ${currency.short.format(Number(stxPrice))}
              </p>
            </div>
            <div className="px-4 py-3 border border-white/10 rounded-lg flex items-center gap-1">
              <BtcLogo className="w-[14px] h-[14px] shrink-0" />
              <p className="text-sm">
                ${currency.short.format(Number(btcPrice))}
              </p>
            </div>
            <WalletConnectButton signOut={signOut} />
          </div>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Stacking Tracker</span>
              <div className="w-10 h-10 bg-orange rounded-full" />
            </a>
            <div className="flex items-center gap-x-4">
              <div className="flex gap-x-2">
                <div className="px-4 py-2 border border-white/10 rounded-lg flex items-center gap-1">
                  <StxLogo className="w-[14px] h-[14px] shrink-0" />
                  <p className="text-sm">
                    ${currency.short.format(Number(stxPrice))}
                  </p>
                </div>
                <div className="px-4 py-2 border border-white/10 rounded-lg flex items-center gap-1">
                  <BtcLogo className="w-[14px] h-[14px] shrink-0" />
                  <p className="text-sm">
                    ${currency.short.format(Number(btcPrice))}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6 text-orange" />
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-my-6">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      "-mx-3 block rounded-lg px-3 py-2 text-2xl font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                      pathname === item.href ||
                        pathname.includes(item.href + "/")
                        ? "text-orange"
                        : "text-white/90"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <WalletConnectButton className="w-full" signOut={signOut} />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
