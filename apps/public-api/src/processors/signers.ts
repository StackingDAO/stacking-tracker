import { signerKeyToPool } from "../constants";

export function getSignersInfoForCycle(
  cycleNumber: number,
  signers: any,
  rewards: any
) {
  const resultSigners: any[] = [];
  for (const signer of signers) {
    const signerRewards = rewards.filter(
      (reward: any) => reward.signerKey === signer.signerKey
    );

    let signerRewardsAmount = 0;
    signerRewards.forEach((reward: any) => {
      signerRewardsAmount += reward.rewardAmount;
    });

    if (signerKeyToPool[signer.signerKey as string]) {
      resultSigners.push({
        name: signerKeyToPool[signer.signerKey as string].name,
        slug: signerKeyToPool[signer.signerKey as string].slug,
        logo: signerKeyToPool[signer.signerKey as string].logo,
        group: signerKeyToPool[signer.signerKey as string].group,
        signer_key: signer.signerKey,
        stackers_count: signer.stackersCount,
        stacked_amount: signer.stackedAmount,
        rewards_amount: signerRewardsAmount,
      });
    } else {
      resultSigners.push({
        signer_key: signer.signerKey,
        stackers_count: signer.stackersCount,
        stacked_amount: signer.stackedAmount,
        rewards_amount: signerRewardsAmount,
      });
    }
  }

  let stackedAmount = 0.0;
  let rewardAmount = 0.0;
  let stackersCount = 0;
  signers.forEach((signer: any) => {
    stackersCount += signer.stackersCount;
    stackedAmount += signer.stackedAmount;
  });
  rewards.forEach((reward: any) => {
    rewardAmount += reward.rewardAmount;
  });

  const resultAggregatedSigners: { [key: string]: any } = {};
  for (const signer of resultSigners) {
    const group = signer.group
      ? signer.group
      : signer.name && signer.stacked_amount > 1000000
        ? signer.name
        : "Other";

    if (!resultAggregatedSigners[group]) {
      resultAggregatedSigners[group] = {
        stackedAmount: signer.stacked_amount,
        rewardsAmount: signer.rewards_amount,
      };
    } else {
      resultAggregatedSigners[group] = {
        stackedAmount:
          resultAggregatedSigners[group].stackedAmount + signer.stacked_amount,
        rewardsAmount:
          resultAggregatedSigners[group].rewardsAmount + signer.rewards_amount,
      };
    }
  }

  return {
    cycle_number: cycleNumber,
    stacked_amount: stackedAmount,
    rewards_amount: rewardAmount,
    signers: Object.keys(resultAggregatedSigners)
      .map((key: string) => {
        return {
          name: key,
          stacked_amount: resultAggregatedSigners[key].stackedAmount,
          rewards_amount: resultAggregatedSigners[key].rewardsAmount,
        };
      })
      .sort((a, b) => b.stacked_amount - a.stacked_amount),
  };
}

export function getSignerEntities(
  signers: any,
  rewards: any,
  stxPrice: number,
  btcPrice: number
) {
  const resultSigners: any[] = [];
  for (const signer of signers) {
    const signerRewards = rewards.filter(
      (reward: any) => reward.signerKey === signer.signerKey
    );

    let signerRewardsAmount = 0;
    signerRewards.forEach((reward: any) => {
      signerRewardsAmount += reward.rewardAmount;
    });

    if (signerKeyToPool[signer.signerKey as string]) {
      resultSigners.push({
        name: signerKeyToPool[signer.signerKey as string].name,
        slug: signerKeyToPool[signer.signerKey as string].slug,
        logo: signerKeyToPool[signer.signerKey as string].logo,
        signer_key: signer.signerKey,
        stackers_count: signer.stackersCount,
        stacked_amount: signer.stackedAmount,
        rewards_amount: signerRewardsAmount,
        stacked_amount_usd: signer.stackedAmount * stxPrice,
        rewards_amount_usd: signerRewardsAmount * btcPrice,
      });
    } else {
      resultSigners.push({
        name: "Unknown",
        slug: signer.signerKey,
        logo: "/logos/default.webp",
        signer_key: signer.signerKey,
        stackers_count: signer.stackersCount,
        stacked_amount: signer.stackedAmount,
        rewards_amount: signerRewardsAmount,
        stacked_amount_usd: signer.stackedAmount * stxPrice,
        rewards_amount_usd: signerRewardsAmount * btcPrice,
      });
    }
  }

  return resultSigners.sort((a, b) => b.stacked_amount - a.stacked_amount);
}
