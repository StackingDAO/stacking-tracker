"use client";
import StxLogo from "./Logos/Stx";

import { useEffect, useState } from "react";
import { useSTXAddress } from "../common/use-stx-address";
import * as api from "../common/public-api";
import { currency } from "../common/utils";
import { Table } from "./Table";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

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
                          <StxLogo className="w-3 h-3 ml-0.5 inline" />
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
                              <StxLogo className="w-3 h-3 ml-0.5 inline" />
                            </div>
                          ) : (
                            <div>
                              {`${currency.rounded.format(position.balance)}`}
                              <StxLogo className="w-3 h-3 ml-0.5 inline" />
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
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="[&>*:first-child]:rounded-l-md [&>*:first-child]:pl-4 [&>*:last-child]:rounded-r-md">
                      <th
                        scope="col"
                        className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35]"
                      >
                        Position
                      </th>
                      <th
                        scope="col"
                        className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35]"
                      >
                        TVL
                      </th>
                      <th
                        scope="col"
                        className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35]"
                      >
                        Gross APY
                      </th>
                      <th
                        scope="col"
                        className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35]"
                      >
                        Balance
                      </th>
                      <th
                        scope="col"
                        className="bg-gray whitespace-nowrap py-2 text-left text-sm font-normal text-white/[0.35]"
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="[&>*:first-child]:pl-4">
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                        <div>
                          <div className="flex items-center">
                            {/* @NOTE: This button here is the trigger to collapse the row below */}
                            <button
                              type="button"
                              className="shrink-0 rounded-lg bg-orange/10 mr-3 w-10 h-10 flex items-center justify-center"
                            >
                              <ChevronDownIcon className="w-5 h-5 text-orange" />
                            </button>
                            <img
                              className="w-8 h-8 mr-3 mt-1"
                              src="/logos/stackingdao.webp"
                            />
                            <div className="flex flex-col">
                              <div className="font-semibold">StackingDAO</div>
                              <div className="text-xs text-white/[0.35]">
                                LST
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                        <div>
                          <div>
                            52,608,166
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              className="w-3 h-3 ml-0.5 inline"
                              viewBox="0 0 274 274"
                            >
                              <rect
                                width="273"
                                height="273"
                                x="0.977"
                                y="0.843"
                                fill="color(display-p3 .9882 .3922 .1961)"
                                rx="136.5"
                              ></rect>
                              <path
                                fill="#fff"
                                fill-rule="evenodd"
                                d="M160.704 114.66c-.499-.857-.428-1.929.143-2.786l23.833-35.363c.643-1 .714-2.215.143-3.215-.571-1.072-1.641-1.643-2.783-1.643h-9.276c-.999 0-1.998.5-2.641 1.429l-27.829 41.436c-.714 1.071-1.856 1.643-3.14 1.643h-3.497c-1.284 0-2.426-.643-3.139-1.643L104.831 73.01c-.571-.929-1.642-1.429-2.641-1.429h-9.276c-1.142 0-2.284.643-2.783 1.715-.571 1.071-.428 2.286.142 3.215l23.834 35.435c.571.785.642 1.857.143 2.714-.5.929-1.356 1.429-2.355 1.429H75.431a3.124 3.124 0 0 0-3.14 3.144v7.715a3.124 3.124 0 0 0 3.14 3.144h124.092a3.124 3.124 0 0 0 3.14-3.144v-7.715c0-1.644-1.213-2.929-2.783-3.144h-36.821c-.999 0-1.927-.5-2.355-1.429Zm-28.115 45.508-27.83 41.436c-.571.929-1.641 1.429-2.64 1.429h-9.277c-1.141 0-2.212-.643-2.783-1.643-.57-1-.5-2.286.143-3.215l23.762-35.363c.571-.857.643-1.858.143-2.786-.499-.858-1.356-1.429-2.355-1.429H75.431a3.124 3.124 0 0 1-3.14-3.144v-7.715a3.124 3.124 0 0 1 3.14-3.144h124.092a3.124 3.124 0 0 1 3.14 3.144v7.715a3.124 3.124 0 0 1-3.14 3.144H163.13c-1.07 0-1.926.5-2.355 1.429-.499.928-.428 1.929.143 2.714l23.834 35.435c.571.929.713 2.143.143 3.215-.571 1.072-1.642 1.715-2.783 1.715h-9.277c-1.07 0-1.998-.5-2.569-1.358l-27.83-41.436c-.713-1.071-1.855-1.643-3.139-1.643H135.8c-1.284 0-2.426.643-3.14 1.643l-.071-.143Z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <div className="text-xs text-white/[0.35]">
                            $100,750,288
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                        14.02%
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                        <div>
                          <div className="font-semibold">
                            94,514
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              className="w-3 h-3 ml-0.5 inline"
                              viewBox="0 0 274 274"
                            >
                              <rect
                                width="273"
                                height="273"
                                x="0.977"
                                y="0.843"
                                fill="color(display-p3 .9882 .3922 .1961)"
                                rx="136.5"
                              ></rect>
                              <path
                                fill="#fff"
                                fill-rule="evenodd"
                                d="M160.704 114.66c-.499-.857-.428-1.929.143-2.786l23.833-35.363c.643-1 .714-2.215.143-3.215-.571-1.072-1.641-1.643-2.783-1.643h-9.276c-.999 0-1.998.5-2.641 1.429l-27.829 41.436c-.714 1.071-1.856 1.643-3.14 1.643h-3.497c-1.284 0-2.426-.643-3.139-1.643L104.831 73.01c-.571-.929-1.642-1.429-2.641-1.429h-9.276c-1.142 0-2.284.643-2.783 1.715-.571 1.071-.428 2.286.142 3.215l23.834 35.435c.571.785.642 1.857.143 2.714-.5.929-1.356 1.429-2.355 1.429H75.431a3.124 3.124 0 0 0-3.14 3.144v7.715a3.124 3.124 0 0 0 3.14 3.144h124.092a3.124 3.124 0 0 0 3.14-3.144v-7.715c0-1.644-1.213-2.929-2.783-3.144h-36.821c-.999 0-1.927-.5-2.355-1.429Zm-28.115 45.508-27.83 41.436c-.571.929-1.641 1.429-2.64 1.429h-9.277c-1.141 0-2.212-.643-2.783-1.643-.57-1-.5-2.286.143-3.215l23.762-35.363c.571-.857.643-1.858.143-2.786-.499-.858-1.356-1.429-2.355-1.429H75.431a3.124 3.124 0 0 1-3.14-3.144v-7.715a3.124 3.124 0 0 1 3.14-3.144h124.092a3.124 3.124 0 0 1 3.14 3.144v7.715a3.124 3.124 0 0 1-3.14 3.144H163.13c-1.07 0-1.926.5-2.355 1.429-.499.928-.428 1.929.143 2.714l23.834 35.435c.571.929.713 2.143.143 3.215-.571 1.072-1.642 1.715-2.783 1.715h-9.277c-1.07 0-1.998-.5-2.569-1.358l-27.83-41.436c-.713-1.071-1.855-1.643-3.139-1.643H135.8c-1.284 0-2.426.643-3.14 1.643l-.071-.143Z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <div className="text-xs text-white/[0.35]">
                            $191,387
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                        <div className="text-right">
                          <a
                            href="https://www.stackingdao.com"
                            className="text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                          >
                            Start Stacking
                          </a>
                        </div>
                      </td>
                    </tr>
                    {/* @TODO: Hide this row when clicked on trigger */}
                    <tr className="">
                      <td colSpan={5}>
                        <table className="w-full table-fixed">
                          <tbody>
                            <tr className="[&>*:first-child]:pl-4">
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div className="flex items-center">
                                    <div className="shrink-0 rounded-lg bg-transparent mr-3 w-10 h-10 flex items-center justify-center">
                                      <div className="w-1 h-[calc(100%+16px)] -mb-4 bg-orange/[0.25] " />
                                    </div>
                                    <img
                                      className="w-8 h-8 mr-3 mt-1"
                                      src="/logos/stackingdao.webp"
                                    />
                                    <div className="flex flex-col">
                                      <div className="font-semibold">
                                        StackingDAO
                                      </div>
                                      <div className="text-xs text-white/[0.35]">
                                        LST
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div>
                                    52,608,166
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      className="w-3 h-3 ml-0.5 inline"
                                      viewBox="0 0 274 274"
                                    >
                                      <rect
                                        width="273"
                                        height="273"
                                        x="0.977"
                                        y="0.843"
                                        fill="color(display-p3 .9882 .3922 .1961)"
                                        rx="136.5"
                                      ></rect>
                                      <path
                                        fill="#fff"
                                        fill-rule="evenodd"
                                        d="M160.704 114.66c-.499-.857-.428-1.929.143-2.786l23.833-35.363c.643-1 .714-2.215.143-3.215-.571-1.072-1.641-1.643-2.783-1.643h-9.276c-.999 0-1.998.5-2.641 1.429l-27.829 41.436c-.714 1.071-1.856 1.643-3.14 1.643h-3.497c-1.284 0-2.426-.643-3.139-1.643L104.831 73.01c-.571-.929-1.642-1.429-2.641-1.429h-9.276c-1.142 0-2.284.643-2.783 1.715-.571 1.071-.428 2.286.142 3.215l23.834 35.435c.571.785.642 1.857.143 2.714-.5.929-1.356 1.429-2.355 1.429H75.431a3.124 3.124 0 0 0-3.14 3.144v7.715a3.124 3.124 0 0 0 3.14 3.144h124.092a3.124 3.124 0 0 0 3.14-3.144v-7.715c0-1.644-1.213-2.929-2.783-3.144h-36.821c-.999 0-1.927-.5-2.355-1.429Zm-28.115 45.508-27.83 41.436c-.571.929-1.641 1.429-2.64 1.429h-9.277c-1.141 0-2.212-.643-2.783-1.643-.57-1-.5-2.286.143-3.215l23.762-35.363c.571-.857.643-1.858.143-2.786-.499-.858-1.356-1.429-2.355-1.429H75.431a3.124 3.124 0 0 1-3.14-3.144v-7.715a3.124 3.124 0 0 1 3.14-3.144h124.092a3.124 3.124 0 0 1 3.14 3.144v7.715a3.124 3.124 0 0 1-3.14 3.144H163.13c-1.07 0-1.926.5-2.355 1.429-.499.928-.428 1.929.143 2.714l23.834 35.435c.571.929.713 2.143.143 3.215-.571 1.072-1.642 1.715-2.783 1.715h-9.277c-1.07 0-1.998-.5-2.569-1.358l-27.83-41.436c-.713-1.071-1.855-1.643-3.139-1.643H135.8c-1.284 0-2.426.643-3.14 1.643l-.071-.143Z"
                                        clip-rule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                  <div className="text-xs text-white/[0.35]">
                                    $100,750,288
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                14.02%
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div className="font-semibold">
                                    94,514
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      className="w-3 h-3 ml-0.5 inline"
                                      viewBox="0 0 274 274"
                                    >
                                      <rect
                                        width="273"
                                        height="273"
                                        x="0.977"
                                        y="0.843"
                                        fill="color(display-p3 .9882 .3922 .1961)"
                                        rx="136.5"
                                      ></rect>
                                      <path
                                        fill="#fff"
                                        fill-rule="evenodd"
                                        d="M160.704 114.66c-.499-.857-.428-1.929.143-2.786l23.833-35.363c.643-1 .714-2.215.143-3.215-.571-1.072-1.641-1.643-2.783-1.643h-9.276c-.999 0-1.998.5-2.641 1.429l-27.829 41.436c-.714 1.071-1.856 1.643-3.14 1.643h-3.497c-1.284 0-2.426-.643-3.139-1.643L104.831 73.01c-.571-.929-1.642-1.429-2.641-1.429h-9.276c-1.142 0-2.284.643-2.783 1.715-.571 1.071-.428 2.286.142 3.215l23.834 35.435c.571.785.642 1.857.143 2.714-.5.929-1.356 1.429-2.355 1.429H75.431a3.124 3.124 0 0 0-3.14 3.144v7.715a3.124 3.124 0 0 0 3.14 3.144h124.092a3.124 3.124 0 0 0 3.14-3.144v-7.715c0-1.644-1.213-2.929-2.783-3.144h-36.821c-.999 0-1.927-.5-2.355-1.429Zm-28.115 45.508-27.83 41.436c-.571.929-1.641 1.429-2.64 1.429h-9.277c-1.141 0-2.212-.643-2.783-1.643-.57-1-.5-2.286.143-3.215l23.762-35.363c.571-.857.643-1.858.143-2.786-.499-.858-1.356-1.429-2.355-1.429H75.431a3.124 3.124 0 0 1-3.14-3.144v-7.715a3.124 3.124 0 0 1 3.14-3.144h124.092a3.124 3.124 0 0 1 3.14 3.144v7.715a3.124 3.124 0 0 1-3.14 3.144H163.13c-1.07 0-1.926.5-2.355 1.429-.499.928-.428 1.929.143 2.714l23.834 35.435c.571.929.713 2.143.143 3.215-.571 1.072-1.642 1.715-2.783 1.715h-9.277c-1.07 0-1.998-.5-2.569-1.358l-27.83-41.436c-.713-1.071-1.855-1.643-3.139-1.643H135.8c-1.284 0-2.426.643-3.14 1.643l-.071-.143Z"
                                        clip-rule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                  <div className="text-xs text-white/[0.35]">
                                    $191,387
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div className="text-right">
                                  <a
                                    href="https://www.stackingdao.com"
                                    className="text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                                  >
                                    Start Stacking
                                  </a>
                                </div>
                              </td>
                            </tr>
                            <tr className="[&>*:first-child]:pl-4">
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div className="flex items-center">
                                    <div className="shrink-0 rounded-lg bg-transparent mr-3 w-10 h-10 flex items-center justify-center">
                                      <div className="w-1 h-[calc(100%+16px)] -mb-4 bg-orange/[0.25] " />
                                    </div>
                                    <img
                                      className="w-8 h-8 mr-3 mt-1"
                                      src="/logos/stackingdao.webp"
                                    />
                                    <div className="flex flex-col">
                                      <div className="font-semibold">
                                        StackingDAO
                                      </div>
                                      <div className="text-xs text-white/[0.35]">
                                        LST
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div>
                                    52,608,166
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      className="w-3 h-3 ml-0.5 inline"
                                      viewBox="0 0 274 274"
                                    >
                                      <rect
                                        width="273"
                                        height="273"
                                        x="0.977"
                                        y="0.843"
                                        fill="color(display-p3 .9882 .3922 .1961)"
                                        rx="136.5"
                                      ></rect>
                                      <path
                                        fill="#fff"
                                        fill-rule="evenodd"
                                        d="M160.704 114.66c-.499-.857-.428-1.929.143-2.786l23.833-35.363c.643-1 .714-2.215.143-3.215-.571-1.072-1.641-1.643-2.783-1.643h-9.276c-.999 0-1.998.5-2.641 1.429l-27.829 41.436c-.714 1.071-1.856 1.643-3.14 1.643h-3.497c-1.284 0-2.426-.643-3.139-1.643L104.831 73.01c-.571-.929-1.642-1.429-2.641-1.429h-9.276c-1.142 0-2.284.643-2.783 1.715-.571 1.071-.428 2.286.142 3.215l23.834 35.435c.571.785.642 1.857.143 2.714-.5.929-1.356 1.429-2.355 1.429H75.431a3.124 3.124 0 0 0-3.14 3.144v7.715a3.124 3.124 0 0 0 3.14 3.144h124.092a3.124 3.124 0 0 0 3.14-3.144v-7.715c0-1.644-1.213-2.929-2.783-3.144h-36.821c-.999 0-1.927-.5-2.355-1.429Zm-28.115 45.508-27.83 41.436c-.571.929-1.641 1.429-2.64 1.429h-9.277c-1.141 0-2.212-.643-2.783-1.643-.57-1-.5-2.286.143-3.215l23.762-35.363c.571-.857.643-1.858.143-2.786-.499-.858-1.356-1.429-2.355-1.429H75.431a3.124 3.124 0 0 1-3.14-3.144v-7.715a3.124 3.124 0 0 1 3.14-3.144h124.092a3.124 3.124 0 0 1 3.14 3.144v7.715a3.124 3.124 0 0 1-3.14 3.144H163.13c-1.07 0-1.926.5-2.355 1.429-.499.928-.428 1.929.143 2.714l23.834 35.435c.571.929.713 2.143.143 3.215-.571 1.072-1.642 1.715-2.783 1.715h-9.277c-1.07 0-1.998-.5-2.569-1.358l-27.83-41.436c-.713-1.071-1.855-1.643-3.139-1.643H135.8c-1.284 0-2.426.643-3.14 1.643l-.071-.143Z"
                                        clip-rule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                  <div className="text-xs text-white/[0.35]">
                                    $100,750,288
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                14.02%
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div className="font-semibold">
                                    94,514
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      className="w-3 h-3 ml-0.5 inline"
                                      viewBox="0 0 274 274"
                                    >
                                      <rect
                                        width="273"
                                        height="273"
                                        x="0.977"
                                        y="0.843"
                                        fill="color(display-p3 .9882 .3922 .1961)"
                                        rx="136.5"
                                      ></rect>
                                      <path
                                        fill="#fff"
                                        fill-rule="evenodd"
                                        d="M160.704 114.66c-.499-.857-.428-1.929.143-2.786l23.833-35.363c.643-1 .714-2.215.143-3.215-.571-1.072-1.641-1.643-2.783-1.643h-9.276c-.999 0-1.998.5-2.641 1.429l-27.829 41.436c-.714 1.071-1.856 1.643-3.14 1.643h-3.497c-1.284 0-2.426-.643-3.139-1.643L104.831 73.01c-.571-.929-1.642-1.429-2.641-1.429h-9.276c-1.142 0-2.284.643-2.783 1.715-.571 1.071-.428 2.286.142 3.215l23.834 35.435c.571.785.642 1.857.143 2.714-.5.929-1.356 1.429-2.355 1.429H75.431a3.124 3.124 0 0 0-3.14 3.144v7.715a3.124 3.124 0 0 0 3.14 3.144h124.092a3.124 3.124 0 0 0 3.14-3.144v-7.715c0-1.644-1.213-2.929-2.783-3.144h-36.821c-.999 0-1.927-.5-2.355-1.429Zm-28.115 45.508-27.83 41.436c-.571.929-1.641 1.429-2.64 1.429h-9.277c-1.141 0-2.212-.643-2.783-1.643-.57-1-.5-2.286.143-3.215l23.762-35.363c.571-.857.643-1.858.143-2.786-.499-.858-1.356-1.429-2.355-1.429H75.431a3.124 3.124 0 0 1-3.14-3.144v-7.715a3.124 3.124 0 0 1 3.14-3.144h124.092a3.124 3.124 0 0 1 3.14 3.144v7.715a3.124 3.124 0 0 1-3.14 3.144H163.13c-1.07 0-1.926.5-2.355 1.429-.499.928-.428 1.929.143 2.714l23.834 35.435c.571.929.713 2.143.143 3.215-.571 1.072-1.642 1.715-2.783 1.715h-9.277c-1.07 0-1.998-.5-2.569-1.358l-27.83-41.436c-.713-1.071-1.855-1.643-3.139-1.643H135.8c-1.284 0-2.426.643-3.14 1.643l-.071-.143Z"
                                        clip-rule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                  <div className="text-xs text-white/[0.35]">
                                    $191,387
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div className="text-right">
                                  <a
                                    href="https://www.stackingdao.com"
                                    className="text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                                  >
                                    Start Stacking
                                  </a>
                                </div>
                              </td>
                            </tr>
                            <tr className="[&>*:first-child]:pl-4">
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div className="flex items-center">
                                    <div className="shrink-0 rounded-lg bg-transparent mr-3 w-10 h-10 flex items-center justify-center">
                                      <div className="w-1 h-[calc(100%+16px)] -mb-4 bg-orange/[0.25] " />
                                    </div>
                                    <img
                                      className="w-8 h-8 mr-3 mt-1"
                                      src="/logos/stackingdao.webp"
                                    />
                                    <div className="flex flex-col">
                                      <div className="font-semibold">
                                        StackingDAO
                                      </div>
                                      <div className="text-xs text-white/[0.35]">
                                        LST
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div>
                                    52,608,166
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      className="w-3 h-3 ml-0.5 inline"
                                      viewBox="0 0 274 274"
                                    >
                                      <rect
                                        width="273"
                                        height="273"
                                        x="0.977"
                                        y="0.843"
                                        fill="color(display-p3 .9882 .3922 .1961)"
                                        rx="136.5"
                                      ></rect>
                                      <path
                                        fill="#fff"
                                        fill-rule="evenodd"
                                        d="M160.704 114.66c-.499-.857-.428-1.929.143-2.786l23.833-35.363c.643-1 .714-2.215.143-3.215-.571-1.072-1.641-1.643-2.783-1.643h-9.276c-.999 0-1.998.5-2.641 1.429l-27.829 41.436c-.714 1.071-1.856 1.643-3.14 1.643h-3.497c-1.284 0-2.426-.643-3.139-1.643L104.831 73.01c-.571-.929-1.642-1.429-2.641-1.429h-9.276c-1.142 0-2.284.643-2.783 1.715-.571 1.071-.428 2.286.142 3.215l23.834 35.435c.571.785.642 1.857.143 2.714-.5.929-1.356 1.429-2.355 1.429H75.431a3.124 3.124 0 0 0-3.14 3.144v7.715a3.124 3.124 0 0 0 3.14 3.144h124.092a3.124 3.124 0 0 0 3.14-3.144v-7.715c0-1.644-1.213-2.929-2.783-3.144h-36.821c-.999 0-1.927-.5-2.355-1.429Zm-28.115 45.508-27.83 41.436c-.571.929-1.641 1.429-2.64 1.429h-9.277c-1.141 0-2.212-.643-2.783-1.643-.57-1-.5-2.286.143-3.215l23.762-35.363c.571-.857.643-1.858.143-2.786-.499-.858-1.356-1.429-2.355-1.429H75.431a3.124 3.124 0 0 1-3.14-3.144v-7.715a3.124 3.124 0 0 1 3.14-3.144h124.092a3.124 3.124 0 0 1 3.14 3.144v7.715a3.124 3.124 0 0 1-3.14 3.144H163.13c-1.07 0-1.926.5-2.355 1.429-.499.928-.428 1.929.143 2.714l23.834 35.435c.571.929.713 2.143.143 3.215-.571 1.072-1.642 1.715-2.783 1.715h-9.277c-1.07 0-1.998-.5-2.569-1.358l-27.83-41.436c-.713-1.071-1.855-1.643-3.139-1.643H135.8c-1.284 0-2.426.643-3.14 1.643l-.071-.143Z"
                                        clip-rule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                  <div className="text-xs text-white/[0.35]">
                                    $100,750,288
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                14.02%
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div className="font-semibold">
                                    94,514
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      className="w-3 h-3 ml-0.5 inline"
                                      viewBox="0 0 274 274"
                                    >
                                      <rect
                                        width="273"
                                        height="273"
                                        x="0.977"
                                        y="0.843"
                                        fill="color(display-p3 .9882 .3922 .1961)"
                                        rx="136.5"
                                      ></rect>
                                      <path
                                        fill="#fff"
                                        fill-rule="evenodd"
                                        d="M160.704 114.66c-.499-.857-.428-1.929.143-2.786l23.833-35.363c.643-1 .714-2.215.143-3.215-.571-1.072-1.641-1.643-2.783-1.643h-9.276c-.999 0-1.998.5-2.641 1.429l-27.829 41.436c-.714 1.071-1.856 1.643-3.14 1.643h-3.497c-1.284 0-2.426-.643-3.139-1.643L104.831 73.01c-.571-.929-1.642-1.429-2.641-1.429h-9.276c-1.142 0-2.284.643-2.783 1.715-.571 1.071-.428 2.286.142 3.215l23.834 35.435c.571.785.642 1.857.143 2.714-.5.929-1.356 1.429-2.355 1.429H75.431a3.124 3.124 0 0 0-3.14 3.144v7.715a3.124 3.124 0 0 0 3.14 3.144h124.092a3.124 3.124 0 0 0 3.14-3.144v-7.715c0-1.644-1.213-2.929-2.783-3.144h-36.821c-.999 0-1.927-.5-2.355-1.429Zm-28.115 45.508-27.83 41.436c-.571.929-1.641 1.429-2.64 1.429h-9.277c-1.141 0-2.212-.643-2.783-1.643-.57-1-.5-2.286.143-3.215l23.762-35.363c.571-.857.643-1.858.143-2.786-.499-.858-1.356-1.429-2.355-1.429H75.431a3.124 3.124 0 0 1-3.14-3.144v-7.715a3.124 3.124 0 0 1 3.14-3.144h124.092a3.124 3.124 0 0 1 3.14 3.144v7.715a3.124 3.124 0 0 1-3.14 3.144H163.13c-1.07 0-1.926.5-2.355 1.429-.499.928-.428 1.929.143 2.714l23.834 35.435c.571.929.713 2.143.143 3.215-.571 1.072-1.642 1.715-2.783 1.715h-9.277c-1.07 0-1.998-.5-2.569-1.358l-27.83-41.436c-.713-1.071-1.855-1.643-3.139-1.643H135.8c-1.284 0-2.426.643-3.14 1.643l-.071-.143Z"
                                        clip-rule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                  <div className="text-xs text-white/[0.35]">
                                    $191,387
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div className="text-right">
                                  <a
                                    href="https://www.stackingdao.com"
                                    className="text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                                  >
                                    Start Stacking
                                  </a>
                                </div>
                              </td>
                            </tr>
                            <tr className="[&>*:first-child]:pl-4">
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div className="flex items-center">
                                    <div className="shrink-0 rounded-lg bg-transparent mr-3 w-10 h-10 flex items-center justify-center">
                                      <div className="w-1 h-[calc(100%+16px)] -mb-4 bg-orange/[0.25] " />
                                    </div>
                                    <img
                                      className="w-8 h-8 mr-3 mt-1"
                                      src="/logos/stackingdao.webp"
                                    />
                                    <div className="flex flex-col">
                                      <div className="font-semibold">
                                        StackingDAO
                                      </div>
                                      <div className="text-xs text-white/[0.35]">
                                        LST
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div>
                                    52,608,166
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      className="w-3 h-3 ml-0.5 inline"
                                      viewBox="0 0 274 274"
                                    >
                                      <rect
                                        width="273"
                                        height="273"
                                        x="0.977"
                                        y="0.843"
                                        fill="color(display-p3 .9882 .3922 .1961)"
                                        rx="136.5"
                                      ></rect>
                                      <path
                                        fill="#fff"
                                        fill-rule="evenodd"
                                        d="M160.704 114.66c-.499-.857-.428-1.929.143-2.786l23.833-35.363c.643-1 .714-2.215.143-3.215-.571-1.072-1.641-1.643-2.783-1.643h-9.276c-.999 0-1.998.5-2.641 1.429l-27.829 41.436c-.714 1.071-1.856 1.643-3.14 1.643h-3.497c-1.284 0-2.426-.643-3.139-1.643L104.831 73.01c-.571-.929-1.642-1.429-2.641-1.429h-9.276c-1.142 0-2.284.643-2.783 1.715-.571 1.071-.428 2.286.142 3.215l23.834 35.435c.571.785.642 1.857.143 2.714-.5.929-1.356 1.429-2.355 1.429H75.431a3.124 3.124 0 0 0-3.14 3.144v7.715a3.124 3.124 0 0 0 3.14 3.144h124.092a3.124 3.124 0 0 0 3.14-3.144v-7.715c0-1.644-1.213-2.929-2.783-3.144h-36.821c-.999 0-1.927-.5-2.355-1.429Zm-28.115 45.508-27.83 41.436c-.571.929-1.641 1.429-2.64 1.429h-9.277c-1.141 0-2.212-.643-2.783-1.643-.57-1-.5-2.286.143-3.215l23.762-35.363c.571-.857.643-1.858.143-2.786-.499-.858-1.356-1.429-2.355-1.429H75.431a3.124 3.124 0 0 1-3.14-3.144v-7.715a3.124 3.124 0 0 1 3.14-3.144h124.092a3.124 3.124 0 0 1 3.14 3.144v7.715a3.124 3.124 0 0 1-3.14 3.144H163.13c-1.07 0-1.926.5-2.355 1.429-.499.928-.428 1.929.143 2.714l23.834 35.435c.571.929.713 2.143.143 3.215-.571 1.072-1.642 1.715-2.783 1.715h-9.277c-1.07 0-1.998-.5-2.569-1.358l-27.83-41.436c-.713-1.071-1.855-1.643-3.139-1.643H135.8c-1.284 0-2.426.643-3.14 1.643l-.071-.143Z"
                                        clip-rule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                  <div className="text-xs text-white/[0.35]">
                                    $100,750,288
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                14.02%
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div>
                                  <div className="font-semibold">
                                    94,514
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      className="w-3 h-3 ml-0.5 inline"
                                      viewBox="0 0 274 274"
                                    >
                                      <rect
                                        width="273"
                                        height="273"
                                        x="0.977"
                                        y="0.843"
                                        fill="color(display-p3 .9882 .3922 .1961)"
                                        rx="136.5"
                                      ></rect>
                                      <path
                                        fill="#fff"
                                        fill-rule="evenodd"
                                        d="M160.704 114.66c-.499-.857-.428-1.929.143-2.786l23.833-35.363c.643-1 .714-2.215.143-3.215-.571-1.072-1.641-1.643-2.783-1.643h-9.276c-.999 0-1.998.5-2.641 1.429l-27.829 41.436c-.714 1.071-1.856 1.643-3.14 1.643h-3.497c-1.284 0-2.426-.643-3.139-1.643L104.831 73.01c-.571-.929-1.642-1.429-2.641-1.429h-9.276c-1.142 0-2.284.643-2.783 1.715-.571 1.071-.428 2.286.142 3.215l23.834 35.435c.571.785.642 1.857.143 2.714-.5.929-1.356 1.429-2.355 1.429H75.431a3.124 3.124 0 0 0-3.14 3.144v7.715a3.124 3.124 0 0 0 3.14 3.144h124.092a3.124 3.124 0 0 0 3.14-3.144v-7.715c0-1.644-1.213-2.929-2.783-3.144h-36.821c-.999 0-1.927-.5-2.355-1.429Zm-28.115 45.508-27.83 41.436c-.571.929-1.641 1.429-2.64 1.429h-9.277c-1.141 0-2.212-.643-2.783-1.643-.57-1-.5-2.286.143-3.215l23.762-35.363c.571-.857.643-1.858.143-2.786-.499-.858-1.356-1.429-2.355-1.429H75.431a3.124 3.124 0 0 1-3.14-3.144v-7.715a3.124 3.124 0 0 1 3.14-3.144h124.092a3.124 3.124 0 0 1 3.14 3.144v7.715a3.124 3.124 0 0 1-3.14 3.144H163.13c-1.07 0-1.926.5-2.355 1.429-.499.928-.428 1.929.143 2.714l23.834 35.435c.571.929.713 2.143.143 3.215-.571 1.072-1.642 1.715-2.783 1.715h-9.277c-1.07 0-1.998-.5-2.569-1.358l-27.83-41.436c-.713-1.071-1.855-1.643-3.139-1.643H135.8c-1.284 0-2.426.643-3.14 1.643l-.071-.143Z"
                                        clip-rule="evenodd"
                                      ></path>
                                    </svg>
                                  </div>
                                  <div className="text-xs text-white/[0.35]">
                                    $191,387
                                  </div>
                                </div>
                              </td>
                              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                                <div className="text-right">
                                  <a
                                    href="https://www.stackingdao.com"
                                    className="text-sm font-semibold leading-6 text-orange px-4 py-2 rounded-lg bg-orange/10"
                                  >
                                    Start Stacking
                                  </a>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

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
                    <StxLogo className="w-3 h-3 ml-0.5 inline" />
                  </div>
                  <div className="text-xs text-white/[0.35]">{`$${currency.rounded.format(position.tvl_usd)}`}</div>
                </div>,
                `${currency.short.format(position.apy)}%`,
                <div key={position.name + "-balance"}>
                  {position.balance > 0 ? (
                    <div className="font-semibold">
                      {`${currency.rounded.format(position.balance)}`}
                      <StxLogo className="w-3 h-3 ml-0.5 inline" />
                    </div>
                  ) : (
                    <div>
                      {`${currency.rounded.format(position.balance)}`}
                      <StxLogo className="w-3 h-3 ml-0.5 inline" />
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
                          <StxLogo className="w-3 h-3 ml-0.5 inline" />
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
                    <StxLogo className="w-3 h-3 ml-0.5 inline" />
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
