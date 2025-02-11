import { tokensList } from "../constants";

export function getTokensInfoForCycle(
  cycleNumber: number,
  stackers: any,
  rewards: any,
  stxPrice: number,
  btcPrice: number,
  stStxBtcSupply: number
) {
  const tokens: any[] = [];
  for (const tokenInfo of tokensList) {
    const tokenStackers = stackers.filter((stacker: any) =>
      stacker.stackerAddress.includes(tokenInfo.address)
    );

    let tokenStackedAmount = 0.0;
    let tokenPoxAddresses = [];
    tokenStackers.forEach((stacker: any) => {
      tokenStackedAmount += stacker.stackedAmount;
      if (!tokenPoxAddresses.includes(stacker.poxAddress)) {
        tokenPoxAddresses.push(stacker.poxAddress);
      }
    });

    // Payout PoX address is for all stackers, not only the LST
    // So we need to find the total payout and the stacked % for the LST
    const rewardStackers = stackers.filter((stacker: any) =>
      tokenPoxAddresses.includes(stacker.poxAddress)
    );

    let rewardStackedAmount = 0.0;
    rewardStackers.forEach((stacker: any) => {
      rewardStackedAmount += stacker.stackedAmount;
    });

    let rewardAmount = 0.0;
    rewards
      .filter((reward: any) =>
        tokenPoxAddresses.includes(reward.rewardRecipient)
      )
      .forEach((reward: any) => {
        rewardAmount += reward.rewardAmount;
      });

    const tokenRewardAmount =
      rewardAmount * (tokenStackedAmount / rewardStackedAmount);

    let share = 1.0;
    if (tokenInfo.name === "stSTX") {
      share = (tokenStackedAmount - stStxBtcSupply) / tokenStackedAmount;
    } else if (tokenInfo.name === "stSTXbtc") {
      share = stStxBtcSupply / tokenStackedAmount;
    }

    const previousStackedValue = tokenStackedAmount * stxPrice;
    const previousRewardsValue = tokenRewardAmount * btcPrice;
    // 26 cycles per year
    const apr = (previousRewardsValue / previousStackedValue) * 26;
    const apy = (Math.pow(1 + apr / 26, 26) - 1) * 100.0;

    tokens.push({
      address: tokenInfo.address,
      name: tokenInfo.name,
      stacked_amount: tokenStackedAmount * share,
      rewards_amount: tokenRewardAmount * share,
      apr: apr * 100.0,
      apy: apy,
    });
  }

  let stackedAmount = 0.0;
  let rewardAmount = 0.0;
  tokens.forEach((token: any) => {
    stackedAmount += token.stacked_amount;
    rewardAmount += token.rewards_amount;
  });

  return {
    cycle_number: cycleNumber,
    tokens: tokens,
    stacked_amount: stackedAmount,
    rewards_amount: rewardAmount,
    stacked_amount_usd: stackedAmount * stxPrice,
    rewards_amount_usd: rewardAmount * btcPrice,
  };
}

export function getTokenEntities(
  cyclesInfo: any,
  stxPrice: number,
  btcPrice: number
) {
  const entities: any[] = [];
  for (const tokenInfo of tokensList) {
    const cycleInfoAddress = [];
    cyclesInfo.forEach((info: any) => {
      const filteredInfo = info.tokens.filter(
        (token: any) => token.name === tokenInfo.name
      )[0];
      cycleInfoAddress.push(filteredInfo);
    });

    var aprSum = 0.0;
    var apySum = 0.0;

    cycleInfoAddress.slice(1).forEach((info: any) => {
      aprSum += info.apr;
      apySum += info.apy;
    });

    entities.push({
      name: tokenInfo.name,
      entity: tokenInfo.entity,
      logo: tokenInfo.logo,
      logo_token: tokenInfo.logo_token,
      slug: tokenInfo.slug,
      website: tokenInfo.website,
      stacked_amount: cycleInfoAddress[0].stacked_amount,
      rewards_amount: cycleInfoAddress[0].rewards_amount,
      stacked_amount_usd: cycleInfoAddress[0].stacked_amount * stxPrice,
      rewards_amount_usd: cycleInfoAddress[0].rewards_amount * btcPrice,
      apr: aprSum / cycleInfoAddress.slice(1).length,
      apy: apySum / cycleInfoAddress.slice(1).length,
    });
  }

  return entities;
}
