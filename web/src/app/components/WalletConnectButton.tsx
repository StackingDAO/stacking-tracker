import { useState, Fragment } from "react";
import { useConnect } from "@stacks/connect-react";
import { useAppContext } from "./AppContext";
import clsx from "clsx";
import { useSTXAddress } from "@/app/common/use-stx-address";
import { resolveProvider } from "@/app/common/utils";
import { ChooseWalletModal } from "./ChooseWalletModal";
import { Menu, Transition } from "@headlessui/react";
import { ExternalLinkIcon, ChevronDownIcon } from "@heroicons/react/outline";
import Link from "next/link";

interface Props {
  className?: string;
  signOut: () => void;
}

export const WalletConnectButton = ({ className, signOut }: Props) => {
  const buttonClass = clsx(
    className,
    "w-36 justify-center inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
    "bg-orange text-black hover:bg-orange/80"
  );

  const { setStxAddress, setOkxProvider } = useAppContext();
  const { doOpenAuth } = useConnect();
  const stxAddress = useSTXAddress();
  const [showChooseWalletModal, setShowChooseWalletModal] = useState(false);

  const showModalOrConnectWallet = async () => {
    const provider = resolveProvider();
    if (provider?.isOkxWallet) {
      const resp = await provider.connect();
      setStxAddress(resp["address"]);
      setOkxProvider(provider);
    } else if (provider) {
      doOpenAuth(true, undefined, provider);
    } else {
      setShowChooseWalletModal(true);
    }
  };

  const onProviderChosen = async (providerString: string) => {
    localStorage.setItem("stacking-tracker-sign-provider", providerString);
    setShowChooseWalletModal(false);

    const provider = resolveProvider();

    if (providerString == "okx") {
      const resp = await provider.connect();
      setStxAddress(resp["address"]);
      setOkxProvider(provider);
    } else {
      doOpenAuth(true, undefined, provider);
    }
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(stxAddress);
  };

  return (
    <>
      <ChooseWalletModal
        open={showChooseWalletModal}
        closeModal={() => setShowChooseWalletModal(false)}
        onProviderChosen={onProviderChosen}
      />

      {!stxAddress ? (
        <button className={buttonClass} onClick={showModalOrConnectWallet}>
          Connect
        </button>
      ) : (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="w-fit justify-center inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition bg-orange text-black hover:bg-orange/80">
              <svg
                className="inline-block w-2 h-2 text-white"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="4" cy="4" r="4" fill="currentColor" />
              </svg>
              {`${stxAddress.slice(0, 4)}...${stxAddress.slice(-4)}`}
              <ChevronDownIcon
                className="w-4 h-4 ml-1 -mr-1"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-gray divide-y divide-white/10 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  <button
                    onClick={copyAddress}
                    className="flex items-center text-white w-full px-2 py-2 text-sm rounded-md group hover:bg-white/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-4 h-4 mr-2 text-orange"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
                      />
                    </svg>
                    Copy address
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    href={`https://explorer.hiro.so/address/${stxAddress}?chain=mainnet`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex items-center text-white w-full px-2 py-2 text-sm rounded-md group hover:bg-white/10"
                  >
                    <ExternalLinkIcon
                      className="w-4 h-4 mr-2 text-orange"
                      aria-hidden="true"
                    />
                    View on Explorer
                  </Link>
                </Menu.Item>
              </div>
              <div className="px-1 py-1">
                <Menu.Item>
                  <button
                    onClick={signOut}
                    className="flex items-center text-white w-full px-2 py-2 text-sm rounded-md group hover:bg-white/10"
                  >
                    <svg
                      className="w-4 h-4 mr-2 text-orange"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                    >
                      <path d="m17 8-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5z" fill="currentColor"></path>
                    </svg>
                    Disconnect
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </>
  );
};
