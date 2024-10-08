// Docs: https://docs.stacks.co/stacks-101/mining
// Still at 1000 STX currently
const rewardsInfo = [
  {
    startBlock: 0,
    rewards: 1000,
  },
  {
    startBlock: 147022,
    rewards: 1000,
  },
  {
    startBlock: 147022 + 210000,
    rewards: 500,
  },
  {
    startBlock: 147022 + 210000 * 2,
    rewards: 250,
  },
];

export function getMinerRewards(blockHeight: number) {
  const filteredInfo = rewardsInfo.filter((info: any) => info.startBlock < blockHeight);
  return filteredInfo[filteredInfo.length - 1].rewards;
}
