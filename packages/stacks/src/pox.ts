import { ProofOfTransferApi, StackingRewardsApi } from '@stacks/blockchain-api-client';
import { configuration } from './constants';

const poxApi = new ProofOfTransferApi(configuration);
const poxRewardsApi = new StackingRewardsApi(configuration);

export async function getCurrentCycle(): Promise<number> {
  const cycles = await poxApi.getPoxCycles({});
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

export async function getBurnchainRewards(burnBlockEnd: number): Promise<any> {
  let result: any[] = [];
  let hasReachedEndBlock = false;

  while (!hasReachedEndBlock) {
    const rewards = await poxRewardsApi.getBurnchainRewardList({
      limit: 250,
      offset: result.length,
    });
    result = result.concat(rewards.results);

    console.log('GOT REWARDS', rewards.results.length, 'total:', result.length);

    hasReachedEndBlock =
      rewards.results.filter((reward: any) => {
        reward.burn_block_height < burnBlockEnd;
      }).length > 0;
  }

  return result;
}
