import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import * as stacks from "@repo/stacks";
import { addressToToken } from "../constants";
import { fetchPrice } from "../prices";

async function getTokensInfoForCycle(cycleNumber: number) {
  const [stackers, rewards] = await Promise.all([
    db.getStackersForCycle(cycleNumber),
    db.getRewardsForCycle(cycleNumber),
  ]);

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

async function getEntities(currentCycle: number) {
  const tokenAddresses = Object.keys(addressToToken).map(
    (key: string) => addressToToken[key].tokenAddress
  );
  const tokenSupplyPromises = tokenAddresses.map((address: string) =>
    stacks.getTotalSupply(address)
  );

  const lastCyclesPromises = [
    getTokensInfoForCycle(currentCycle),
    getTokensInfoForCycle(currentCycle - 1),
    getTokensInfoForCycle(currentCycle - 2),
    getTokensInfoForCycle(currentCycle - 3),
    getTokensInfoForCycle(currentCycle - 4),
  ];

  const [stxPrice, btcPrice, cyclesInfo, tokensSupply] = await Promise.all([
    fetchPrice("STX"),
    fetchPrice("BTC"),
    Promise.all(lastCyclesPromises),
    Promise.all(tokenSupplyPromises),
  ]);

  const entities: any[] = [];
  for (const address of Object.keys(addressToToken)) {
    const tokensSupplyIndex = Object.keys(addressToToken).indexOf(address);
    const tokenSupply = tokensSupply[tokensSupplyIndex];

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

    const previousStackedValue = (previousStacked / 4) * stxPrice;
    const previousRewardsValue = (previousRewards / 4) * btcPrice;
    // 25 cycles per year
    const apy = (previousRewardsValue / previousStackedValue) * 25 * 100;

    // Price compared to STX
    var tokenPrice = 1.0;
    if (addressToToken[address].entity === "StackingDAO") {
      tokenPrice = await stacks.getStxPerStStx();
    }

    entities.push({
      name: addressToToken[address].name,
      entity: addressToToken[address].entity,
      logo: addressToToken[address].logo,
      slug: addressToToken[address].slug,
      token_supply: tokenSupply,
      token_mcap: tokenSupply * stxPrice * tokenPrice,
      stacked_amount: cycleInfoAddress[0].stacked_amount,
      rewards_amount: cycleInfoAddress[0].rewards_amount,
      stacked_amount_usd: cycleInfoAddress[0].stacked_amount * stxPrice,
      rewards_amount_usd: cycleInfoAddress[0].rewards_amount * btcPrice,
      apy: apy,
    });
  }

  return entities;
}

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const currentCycle = await db.getSignersLatestCycle();

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > 83; cycle--) {
    promises.push(getTokensInfoForCycle(cycle));
  }
  const results = await Promise.all(promises);

  res.send({
    cycles: results.reverse(),
    entities: await getEntities(currentCycle),
  });
});

export default router;
