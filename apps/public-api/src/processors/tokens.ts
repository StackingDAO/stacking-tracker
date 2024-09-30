import { addressToToken } from "../constants";
import * as stacks from "@repo/stacks";

export function getTokensInfoForCycle(
  cycleNumber: number,
  stackers: any,
  rewards: any
) {
  const tokens: any[] = [];
  for (const address of Object.keys(addressToToken)) {
    const tokenStackers = stackers.filter((stacker: any) =>
      stacker.stackerAddress.includes(address)
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

    tokens.push({
      address: address,
      name: addressToToken[address].entity,
      stacked_amount: tokenStackedAmount,
      rewards_amount: tokenRewardAmount,
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
  };
}

export function getTokenEntities(
  cyclesInfo: any,
  stxPrice: number,
  btcPrice: number
) {
  const entities: any[] = [];
  for (const address of Object.keys(addressToToken)) {
    const cycleInfoAddress = [];
    cyclesInfo.forEach((info: any) => {
      const filteredInfo = info.tokens.filter(
        (token: any) => token.name === addressToToken[address].entity
      )[0];
      cycleInfoAddress.push(filteredInfo);
    });

    var previousStacked = 0.0;
    var previousRewards = 0.0;
    cycleInfoAddress.slice(1).forEach((info: any) => {
      previousStacked += info.stacked_amount;
      previousRewards += info.rewards_amount;
    });

    const previousStackedValue =
      (previousStacked / (cyclesInfo.length - 1)) * stxPrice;
    const previousRewardsValue =
      (previousRewards / (cyclesInfo.length - 1)) * btcPrice;
    // 26 cycles per year
    const apr = (previousRewardsValue / previousStackedValue) * 26;
    const apy = (Math.pow(1 + apr / 26, 26) - 1) * 100.0;

    entities.push({
      name: addressToToken[address].name,
      entity: addressToToken[address].entity,
      logo: addressToToken[address].logo,
      logo_token: addressToToken[address].logo_token,
      slug: addressToToken[address].slug,
      website: addressToToken[address].website,
      stacked_amount: cycleInfoAddress[0].stacked_amount,
      rewards_amount: cycleInfoAddress[0].rewards_amount,
      stacked_amount_usd: cycleInfoAddress[0].stacked_amount * stxPrice,
      rewards_amount_usd: cycleInfoAddress[0].rewards_amount * btcPrice,
      apy: apy,
    });
  }

  return entities;
}
