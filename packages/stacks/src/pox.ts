import { ProofOfTransferApi, StackingRewardsApi } from '@stacks/blockchain-api-client';
import { configuration } from './constants';

const poxApi = new ProofOfTransferApi(configuration);
const poxRewardsApi = new StackingRewardsApi(configuration);

export async function getCurrentCycle(): Promise<number> {
  const cycles = await poxApi.getPoxCycles({ limit: 1 });
  return cycles.results[0].cycle_number;
}

export async function getCycles(): Promise<any> {
  // TODO: get all pages
  const cycles = await poxApi.getPoxCycles({});
  return cycles.results;
}

export async function getCycleSigners(cycleNumber: number): Promise<any> {
  // TODO: get all pages
  const signers = await poxApi.getPoxCycleSigners({ cycleNumber: cycleNumber });
  return signers.results;
}

export async function getCycleSigner(cycleNumber: number, signerKey: string): Promise<any> {
  // TODO: get all pages
  const signer = await poxApi.getPoxCycleSigner({
    cycleNumber: cycleNumber,
    signerKey: signerKey,
  });
  return signer;
}

export async function getSignerStackers(cycleNumber: number, signerKey: string): Promise<any> {
  // TODO: get all pages
  const stackers = await poxApi.getPoxCycleSignerStackers({
    cycleNumber: cycleNumber,
    signerKey: signerKey,
  });
  return stackers.results;
}

// Rewards are an endliss list, newest rewards first
// The `burnBlockEnd` param sets a limit on how far to go in the list
// The list is capped to a max
export async function getBurnchainRewards(burnBlockEnd: number, offset: number = 0): Promise<any> {
  let result: any[] = [];
  let hasReachedEndBlock = false;

  while (!hasReachedEndBlock && result.length < 5000) {
    const rewards = await poxRewardsApi.getBurnchainRewardList({
      limit: 250,
      offset: offset + result.length,
    });
    const filteredResults = rewards.results.filter(
      (reward: any) => reward.burn_block_height > burnBlockEnd
    );
    result = result.concat(filteredResults);

    hasReachedEndBlock =
      filteredResults.length === 0 || rewards.results.length !== filteredResults.length;
  }

  return result;
}
