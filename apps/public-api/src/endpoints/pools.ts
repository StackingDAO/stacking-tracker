import { Router, Request, Response } from "express";
import * as db from "@repo/database";

const poxAddressName = {
  // bc1q9ll6ngymkla8mnk5fq6dwlhgr3yutuxvg3whz5: "StackingDAO",
  bc1qmv2pxw5ahvwsu94kq5f520jgkmljs3af8ly6tr: "Xverse Pool",
  bc1qs0kkdpsrzh3ngqgth7mkavlwlzr7lms2zv3wxe: "Fast Pool",
  bc1qs33quxgnwkrspgu82lmaczw7gtcfa88pll8fqm: "Planbetter Pool",
  "15uuC9CPwSuV3inJcuU5Uon111yosYbzAb": "BlockDeamon",
  "1FLWPsqVv6wu2iEwwy12bwV57qAm2GcY9g": "BlockDeamon",
  bc1qkftpwzv3s7haayjccyyu0fdh3elhwr5fkkujm7: "Luxor",
  bc1pfesd05mvw62uglxduepsx9jdtkug5zxzg8x79ffcj4acjk8qnthqzrktqf:
    "Staking Defense League",
  bc1qsfahfanetg4v75x6qj82mvs033le6sfflghpws: "Senseinode",
  bc1qxf5ephyanvpxe593a3kg36cx0k92dq3yua46n2: "Kiln",
};

const poxAddressStackerNames = {
  bc1q9ll6ngymkla8mnk5fq6dwlhgr3yutuxvg3whz5: {
    "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-delegate-1-":
      "StackingDAO",

    "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-delegate-blockdaemon-":
      "StackingDAO - BlockDaemon",
    "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-delegate-luganodes-":
      "StackingDAO - Luganodes",
    "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-delegate-alum-labs-":
      "StackingDAO - Alum Labs",
    "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-delegate-kiln-":
      "StackingDAO - Kiln",
    "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-delegate-restake-":
      "StackingDAO - Restake",
    "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-delegate-chorus-one-":
      "StackingDAO - Chorus One",
    "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-delegate-despread-":
      "StackingDAO - DeSpread",
    "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-delegate-infstones-":
      "StackingDAO - Infstones",
  },
};

async function getPoolsInfoForBlock(blockHeight: number) {
  const [stackers, rewards] = await Promise.all([
    db.getStackersForCycle(blockHeight),
    db.getRewardsForCycle(blockHeight),
  ]);

  const poxAddresses = [
    ...new Set(stackers.map((stacker: any) => stacker.poxAddress)),
  ];

  const pools: any[] = [];
  for (const poxAddress of poxAddresses) {
    let stackedAmount = 0.0;
    let rewardAmount = 0.0;
    stackers
      .filter((stacker: any) => stacker.poxAddress === poxAddress)
      .forEach((stacker: any) => {
        stackedAmount += stacker.stackedAmount;
      });
    rewards
      .filter((reward: any) => reward.rewardRecipient === poxAddress)
      .forEach((reward: any) => {
        rewardAmount += reward.rewardAmount;
      });

    const stackerNames = poxAddressStackerNames[poxAddress as string];
    if (stackerNames) {
      for (const poolKey of Object.keys(stackerNames)) {
        let stackerStackedAmount = 0.0;
        stackers
          .filter(
            (stacker: any) =>
              stacker.poxAddress === poxAddress &&
              stacker.stackerAddress.includes(poolKey)
          )
          .forEach((stacker: any) => {
            stackerStackedAmount += stacker.stackedAmount;
          });

        pools.push({
          name: stackerNames[poolKey],
          pox_address: poxAddress,
          stacked_amount: stackerStackedAmount,
          rewards_amount: rewardAmount * (stackerStackedAmount / stackedAmount),
        });
      }
    } else {
      pools.push({
        name: poxAddressName[poxAddress as string] ?? "-",
        pox_address: poxAddress,
        stacked_amount: stackedAmount,
        rewards_amount: rewardAmount,
      });
    }
  }

  pools.sort((a, b) => b.stacked_amount - a.stacked_amount);

  let stackedAmount = 0.0;
  let rewardAmount = 0.0;
  stackers.forEach((stacker: any) => {
    stackedAmount += stacker.stackedAmount;
  });
  rewards.forEach((reward: any) => {
    rewardAmount += reward.rewardAmount;
  });

  return {
    cycle_number: blockHeight,
    pools: pools,
    stacked_amount: stackedAmount,
    rewards_amount: rewardAmount,
  };
}

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const currentCycle = await db.getSignersLatestCycle();

  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > currentCycle - 6; cycle--) {
    promises.push(getPoolsInfoForBlock(cycle));
  }

  const results = await Promise.all(promises);

  res.send(results);
});

export default router;
