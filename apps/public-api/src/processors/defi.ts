export function getDefiEntities(
  stStxPrice: number,
  balances: {
    ststx: {
      arkadiko: number;
      bitflow: number;
      hermetica: number;
      velar: number;
      zest: number;
    };
    ststxbtc: {
      zest: number;
    };
  }
) {
  let protocols: any[] = [];

  protocols.push({
    type: "defi",
    token: "stSTX",
    id: "ststx-arkadiko",
    name: "Arkadiko stSTX vault",
    logo: "/logos/arkadiko.webp",
    stacked_amount: balances.ststx.arkadiko,
    stacked_amount_usd: balances.ststx.arkadiko * stStxPrice,
    website: "https://arkadiko.finance/",
  });

  protocols.push({
    type: "defi",
    token: "stSTX",
    id: "ststx-bitflow",
    name: "BitFlow stSTX/STX LP",
    logo: "/logos/bitflow.webp",
    stacked_amount: balances.ststx.bitflow,
    stacked_amount_usd: balances.ststx.bitflow * stStxPrice,
    website: "https://www.bitflow.finance/",
  });

  protocols.push({
    type: "defi",
    token: "stSTX",
    id: "ststx-hermetica",
    name: "Hermetica stSTX vault",
    logo: "/logos/hermetica.webp",
    stacked_amount: balances.ststx.hermetica,
    stacked_amount_usd: balances.ststx.hermetica * stStxPrice,
    website: "https://www.hermetica.fi/",
  });

  protocols.push({
    type: "defi",
    token: "stSTX",
    id: "ststx-velar",
    name: "Velar stSTX/aeUSDC LP",
    logo: "/logos/velar.webp",
    stacked_amount: balances.ststx.velar,
    stacked_amount_usd: balances.ststx.velar * stStxPrice,
    website: "https://www.velar.co/",
  });

  protocols.push({
    type: "defi",
    token: "stSTX",
    id: "ststx-zest",
    name: "Zest stSTX collateral",
    logo: "/logos/zest.webp",
    stacked_amount: balances.ststx.zest,
    stacked_amount_usd: balances.ststx.zest * stStxPrice,
    website: "https://www.zestprotocol.com/",
  });

  protocols.push({
    type: "defi",
    token: "stSTXbtc",
    id: "ststxbtc-zest",
    name: "Zest stSTXbtc collateral",
    logo: "/logos/zest.webp",
    stacked_amount: balances.ststxbtc.zest,
    stacked_amount_usd: balances.ststxbtc.zest * stStxPrice,
    website: "https://www.zestprotocol.com/",
  });

  return protocols;
}
