export function getPositions(pools: any, tokens: any, defi: any, solo: any) {
  let positions: any[] = [];

  tokens.forEach((token: any) => {
    positions.push({
      type: "LST",
      id: token.slug,
      name: token.entity,
      symbol: token.name,
      logo: token.logo,
      tvl: token.stacked_amount,
      tvl_usd: token.stacked_amount_usd,
      apr: token.apr,
      apy: token.apy,
      link: token.website,
    });
  });

  pools.forEach((pool: any) => {
    // StackingDAO is listed as LST so removed from pools
    if (pool.slug !== "stackingdao") {
      positions.push({
        type: "Pool",
        id: pool.slug,
        name: pool.name,
        symbol: "STX",
        logo: pool.logo,
        tvl: pool.stacked_amount,
        tvl_usd: pool.stacked_amount_usd,
        apr: pool.apr,
        apy: pool.apy,
        link: pool.website,
      });
    }
  });

  const stStxToken = tokens.filter((token: any) => token.name == "stSTX")[0];
  const stStxBtcToken = tokens.filter(
    (token: any) => token.name == "stSTXbtc"
  )[0];

  defi.forEach((protocol: any) => {
    positions.push({
      type: "DeFi",
      id: protocol.id,
      name: protocol.name,
      symbol: protocol.token,
      logo: protocol.logo,
      tvl: protocol.stacked_amount,
      tvl_usd: protocol.stacked_amount_usd,
      apr: protocol.token === "stSTX" ? stStxToken.apr : stStxBtcToken.apr,
      apy: protocol.token === "stSTX" ? stStxToken.apy : stStxBtcToken.apy,
      link: protocol.website,
    });
  });

  positions.push({
    type: "Stacking",
    id: "solo-stacking",
    name: "Solo Stacking",
    symbol: "BTC",
    logo: "/logos/stx.webp",
    tvl: solo.tvl,
    tvl_usd: solo.tvl_usd,
    apr: solo.apr,
    apy: solo.apy,
    link: "https://solo.stacking.tools/",
  });

  return positions.sort((a, b) => {
    return b.tvl - a.tvl;
  });
}
