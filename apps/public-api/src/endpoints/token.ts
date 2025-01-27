import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import * as stacks from "@repo/stacks";
import {
  fetchCyclePrices,
  fetchCyclesStStxBtcSupply,
  fetchCycleStStxBtcSupply,
  fetchPrice,
} from "../prices";
import { tokensList } from "../constants";

async function getTokenInfoForCycle(
  cycleNumber: number,
  tokenInfo: any,
  stxPrice: number,
  btcPrice: number,
  stStxBtcSupply: number
) {
  const [stackers, rewards] = await Promise.all([
    db.getStackersForCycle(cycleNumber),
    db.getRewardsForCycle(cycleNumber),
  ]);

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
    .filter((reward: any) => tokenPoxAddresses.includes(reward.rewardRecipient))
    .forEach((reward: any) => {
      rewardAmount += reward.rewardAmount;
    });

  const tokenRewardAmount =
    rewardAmount * (tokenStackedAmount / rewardStackedAmount);

  const previousStackedValue = tokenStackedAmount * stxPrice;
  const previousRewardsValue = tokenRewardAmount * btcPrice;
  // 26 cycles per year
  const apr = (previousRewardsValue / previousStackedValue) * 26;
  const apy = (Math.pow(1 + apr / 26, 26) - 1) * 100.0;

  let share = 1.0;
  if (tokenInfo.name === "stSTX") {
    share = (tokenStackedAmount - stStxBtcSupply) / tokenStackedAmount;
  } else if (tokenInfo.name === "stSTXbtc") {
    share = stStxBtcSupply / tokenStackedAmount;
  }

  return {
    cycle_number: cycleNumber,
    stacked_amount: tokenStackedAmount * share,
    rewards_amount: tokenRewardAmount * share,
    apy: share ? apy : 0.0,
  };
}

const router = Router();

router.get("/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const tokenInfo = tokensList.filter((elem: any) => elem.slug === slug)[0];

  const [currentCycle, prices, stStxBtcSupply] = await Promise.all([
    db.getSignersLatestCycle(),
    fetchCyclePrices(84),
    fetchCyclesStStxBtcSupply(84),
  ]);

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle >= 84; cycle--) {
    promises.push(
      getTokenInfoForCycle(
        cycle,
        tokenInfo,
        prices[cycle].stx,
        prices[cycle].btc,
        stStxBtcSupply[cycle].supply
      )
    );
  }

  const results = await Promise.all(promises);
  console.log("RESULTS", results);
  res.send({
    name: tokenInfo.name,
    entity: tokenInfo.entity,
    logo: tokenInfo.logo,
    logo_token: tokenInfo.logo_token,
    website: tokenInfo.website,
    cycles: results.filter((result) => result.stacked_amount > 0).reverse(),
  });
});

export default router;
