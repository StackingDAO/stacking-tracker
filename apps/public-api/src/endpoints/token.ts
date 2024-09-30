import { Router, Request, Response } from "express";
import * as db from "@repo/database";
import { addressToToken } from "../constants";

async function getPoolsInfoForCycle(cycleNumber: number, address: string) {
  const [stackers, rewards] = await Promise.all([
    db.getStackersForCycle(cycleNumber),
    db.getRewardsForCycle(cycleNumber),
  ]);

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
    .filter((reward: any) => tokenPoxAddresses.includes(reward.rewardRecipient))
    .forEach((reward: any) => {
      rewardAmount += reward.rewardAmount;
    });

  const tokenRewardAmount =
    rewardAmount * (tokenStackedAmount / rewardStackedAmount);

  return {
    cycle_number: cycleNumber,
    stacked_amount: tokenStackedAmount,
    rewards_amount: tokenRewardAmount,
  };
}

const router = Router();

router.get("/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const address = Object.keys(addressToToken).filter(
    (key: string) => addressToToken[key].slug === slug
  )[0];

  const currentCycle = await db.getSignersLatestCycle();

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > 83; cycle--) {
    promises.push(getPoolsInfoForCycle(cycle, address));
  }

  const results = await Promise.all(promises);
  res.send({
    name: addressToToken[address].name,
    entity: addressToToken[address].entity,
    logo: addressToToken[address].logo,
    logo_token: addressToToken[address].logo_token,
    website: addressToToken[address].website,
    cycles: results.reverse(),
  });
});

export default router;
