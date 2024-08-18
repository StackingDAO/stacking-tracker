// @ts-nocheck

import { RPCClient } from "@stacks/rpc-client";
import { StacksMainnet, StacksTestnet } from "@stacks/network";
import { MempoolApi } from "@stacks/blockchain-api-client";

require("dotenv").config();

const env = process.env.NEXT_PUBLIC_NETWORK_ENV || "mainnet";

// export let coreApiUrl = "https://api.hiro.so";
export let coreApiUrl =
  "https://small-solemn-frost.stacks-mainnet.discover.quiknode.pro/deaf86bafdfbef850e40cdf5fa22c41cd447cdff";

if (env.includes("mocknet")) {
  coreApiUrl = `http://localhost:${process.env.LOCAL_STACKS_API_PORT || 3999}`;
  // coreApiUrl = 'https://dull-liger-41.loca.lt';
} else if (env.includes("testnet")) {
  coreApiUrl = "https://api.testnet.hiro.so";
} else if (env.includes("regtest")) {
  coreApiUrl = "https://stacks-node-api.regtest.stacks.co";
}

export function getExplorerLink(txId: string) {
  const url = location.origin.includes("localhost")
    ? `http://localhost:3999/extended/v1/tx/${txId}`
    : `https://explorer.hiro.so/txid/${txId}?chain=mainnet`;
  return url;
}

export const getMempoolAPIClient = () => {
  return new MempoolApi();
};

export const getRPCClient = () => {
  return new RPCClient(coreApiUrl);
};

export const stacksNetwork =
  env === "mainnet" ? new StacksMainnet() : new StacksTestnet();
(stacksNetwork.coreApiUrl as any) = coreApiUrl;

export const blocksToTime = (blocks: number) => {
  const minutesPerBlock = 10;
  const minutesLeft = blocks * minutesPerBlock;
  const hoursLeft = Math.floor(minutesLeft / 60);

  const days = Math.floor(hoursLeft / 24);
  const hours = Math.round(hoursLeft % 24);
  const minutes = Math.round(minutesLeft % 60);

  if (days == 0 && hours == 0) {
    return minutes + "m";
  } else if (days == 0 && minutes == 0) {
    return hours + "h";
  } else if (hours == 0 && minutes == 0) {
    return days + "d";
  } else if (days == 0) {
    return hours + "h, " + minutes + "m";
  } else if (hours == 0) {
    return days + "d, " + minutes + "m";
  } else if (minutes == 0) {
    return days + "d, " + hours + "h";
  }
  return days + "d, " + hours + "h, " + minutes + "m";
};

export const resolveProvider = () => {
  const providerName = localStorage.getItem("stacking-tracker-sign-provider");
  if (!providerName) return null;

  if (providerName === "xverse" && window.XverseProviders?.StacksProvider) {
    return window.XverseProviders?.StacksProvider;
  } else if (providerName === "asigna" && window.AsignaProvider) {
    return window.AsignaProvider;
  } else if (
    providerName === "okx" &&
    window.okxwallet &&
    window.okxwallet?.stacks
  ) {
    return window.okxwallet.stacks;
  } else if (window.LeatherProvider) {
    return window.LeatherProvider;
  } else if (window.HiroWalletProvider) {
    return window.HiroWalletProvider;
  } else {
    return window.StacksProvider;
  }
};

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const formatSeconds = function (totalmins) {
  if (Math.sign(totalmins) != -1) {
    const mins = totalmins % 60;
    const hours = Math.floor(totalmins / 60);
    const days = Math.floor(hours / 24);
    const hourss = hours % 24;
    return days + "d, " + hourss + "h, " + mins + "m";
  } else {
    const absTotal = Math.abs(totalmins);
    const mins = absTotal % 60;
    const hours = Math.floor(absTotal / 60);
    const days = Math.floor(hours / 24);
    const hourss = hours % 24;
    return days + "d, " + hourss + "h, " + mins + "m";
  }
};

// Currency formatter to avoid unnecessary Intl database lookups. See:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
export const currency = {
  // the default en-US number formatter
  default: new Intl.NumberFormat("en-US"),
  // can be used for anything that needs no decimals
  rounded: new Intl.NumberFormat("en-US", {
    style: "decimal",

    maximumFractionDigits: 0,
  }),
  // usually for fiat (e.g. $ 3,230.00)
  short: new Intl.NumberFormat("en-US", {
    style: "decimal",

    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  // usually for crypto (e.g. stSTX 5.009331)
  long: new Intl.NumberFormat("en-US", {
    style: "decimal",

    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }),
} as const;

export function shortAddress(address) {
  if (address.length <= 10) {
    return address;
  }

  if (address.includes(".")) {
    let addressSplit = address.split(".");

    const firstPart = addressSplit[0].slice(0, 4);
    const lastPart = addressSplit[0].slice(-4);
    return `${firstPart}...${lastPart}.${addressSplit[1]}`;
  }

  const firstPart = address.slice(0, 4);
  const lastPart = address.slice(-4);
  return `${firstPart}...${lastPart}`;
}
