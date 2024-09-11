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
        apy: pool.apy,
        link: pool.website,
      });
    }
  });

  const stackingDaoToken = tokens.filter(
    (token: any) => token.name == "stSTX"
  )[0];

  defi.forEach((protocol: any) => {
    positions.push({
      type: "DeFi",
      id: protocol.id,
      name: protocol.name,
      symbol: "stSTX",
      logo: protocol.logo,
      tvl: protocol.stacked_amount,
      tvl_usd: protocol.stacked_amount_usd,
      apy: stackingDaoToken.apy,
      link: protocol.website,
    });
  });

  positions.push({
    type: "Stacking",
    id: "solo-stacking",
    name: "Solo Stacking",
    symbol: "STX",
    logo: "/logos/default.webp",
    tvl: solo.tvl, // TODO: get current solo stackers from DB
    tvl_usd: solo.tvl_usd,
    apy: solo.apy, // TODO: should be for solo stackers
    link: "https://solo.stacking.tools/",
  });

  return positions.sort((a, b) => {
    return b.tvl - a.tvl;
  });
}
