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
