import { addressToToken } from "../constants";

export function getDefiEntities(
  stStxPrice: number,
  balances: {
    arkadiko: number;
    bitflow: number;
    hermetica: number;
    velar: number;
    zest: number;
  }
) {
  let protocols: any[] = [];

  protocols.push({
    type: "defi",
    id: "ststx-arkadiko",
    name: "Arkadiko stSTX vault",
    logo: "/logos/arkadiko.webp",
    stacked_amount: balances.arkadiko,
    stacked_amount_usd: balances.arkadiko * stStxPrice,
    website: "https://arkadiko.finance/",
  });

  protocols.push({
    type: "defi",
    id: "ststx-bitflow",
    name: "BitFlow stSTX/STX LP",
    logo: "/logos/bitflow.webp",
    stacked_amount: balances.bitflow,
    stacked_amount_usd: balances.bitflow * stStxPrice,
    website: "https://www.bitflow.finance/",
  });

  protocols.push({
    type: "defi",
    id: "ststx-hermetica",
    name: "Hermetica stSTX vault",
    logo: "/logos/hermetica.webp",
    stacked_amount: balances.hermetica,
    stacked_amount_usd: balances.hermetica * stStxPrice,
    website: "https://www.hermetica.fi/",
  });

  protocols.push({
    type: "defi",
    id: "ststx-velar",
    name: "Velar stSTX/aeUSDC LP",
    logo: "/logos/velar.webp",
    stacked_amount: balances.velar,
    stacked_amount_usd: balances.velar * stStxPrice,
    website: "https://www.velar.co/",
  });

  protocols.push({
    type: "defi",
    id: "ststx-zest",
    name: "Zest stSTX collateral",
    logo: "/logos/zest.webp",
    stacked_amount: balances.zest,
    stacked_amount_usd: balances.zest * stStxPrice,
    website: "https://www.zestprotocol.com/",
  });

  return protocols;
}
