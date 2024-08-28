import { ProofOfTransferApi, StackingRewardsApi } from '@stacks/blockchain-api-client';
import { configuration } from './constants';
import { StacksExtended } from './stacks-api';

const poxApi = new ProofOfTransferApi(configuration);
const poxRewardsApi = new StackingRewardsApi(configuration);
const stacksExtended = new StacksExtended();

export async function getPox(): Promise<any> {
  const result = await stacksExtended.getPox();
  return result;
}

export async function getCurrentCycle(): Promise<number> {
  const cycles = await poxApi.getPoxCycles({ limit: 1 });
  return cycles.results[0].cycle_number;
}

export async function getCycles(): Promise<any> {
  let result: any[] = [];
  let hasReachedEndBlock = false;

  while (!hasReachedEndBlock) {
    const cycles = await poxApi.getPoxCycles({ limit: 60, offset: result.length });
    result = result.concat(cycles.results);
    hasReachedEndBlock = cycles.results.length < 60;
  }

  return result;
}

export async function getCycleSigners(cycleNumber: number): Promise<any> {
  let result: any[] = [];
  let hasReachedEndBlock = false;

  while (!hasReachedEndBlock) {
    const info = await stacksExtended.getPoxCycleSigners(cycleNumber, 250, result.length);
    result = result.concat(info.results);
    hasReachedEndBlock = info.results.length < 250;
  }

  return result;
}

export async function getCycleSigner(cycleNumber: number, signerKey: string): Promise<any> {
  const info = await poxApi.getPoxCycleSigner({ cycleNumber: cycleNumber, signerKey: signerKey });
  return info;
}

export async function getSignerStackers(cycleNumber: number, signerKey: string): Promise<any> {
  let result: any[] = [];
  let hasReachedEndBlock = false;

  while (!hasReachedEndBlock) {
    const stackers = await stacksExtended.getStackersForSignerInCycle(
      signerKey,
      cycleNumber,
      250,
      result.length
    );
    result = result.concat(stackers.results);
    hasReachedEndBlock = stackers.results.length < 250;
  }

  return result;
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
