// @ts-nocheck

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
  if (!address.startsWith("0x") || address.length <= 10) {
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

export function numberToDaysAndHours(number) {
  const days = Math.floor(number);
  const hours = Math.floor((number - days) * 24);

  if (days === 0 && hours === 0) {
    return "1 Hour";
  }

  const dayString = days > 0 ? `${days} ${days === 1 ? "Day" : "Days"}` : "";
  const hourString =
    hours > 0 ? `${hours} ${hours === 1 ? "Hour" : "Hours"}` : "";

  return [dayString, hourString].filter(Boolean).join(", ");
}

export function generateMetaData(title, description) {
  return {
    metadataBase: new URL("https://www.stacking-tracker.com/"),
    title: title,
    description: description,
    applicationName: "Stacking Tracker",

    openGraph: {
      title: title,
      description: description,
      url: "https://www.stacking-tracker.com/",
      siteName: "Stacking Tracker",
      images: [
        {
          url: "https://www.stacking-tracker.com/share.png",
          width: 500,
          height: 500,
        },
      ],
      locale: "en",
      type: "website",
    },

    twitter: {
      title: title,
      description: description,
      site: "https://www.stacking-tracker.com/",
      card: "summary",
      images: ["https://www.stacking-tracker.com/share.png"],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
