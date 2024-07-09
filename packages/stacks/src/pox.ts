import { ProofOfTransferApi, StackingRewardsApi } from '@stacks/blockchain-api-client';
import { configuration } from './constants';

const poxApi = new ProofOfTransferApi(configuration);
const poxRewardsApi = new StackingRewardsApi(configuration);

export async function getCurrentCycle(): Promise<number> {
  const cycles = await poxApi.getPoxCycles({});
  return cycles.results[0].cycle_number;
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

export async function getBurnchainRewardsForAddress(address: string): Promise<any> {
  // TODO: get all pages
  const signers = await poxRewardsApi.getBurnchainRewardListByAddress({ address: address });
  return signers.results;
}

export async function getBurnchainRewards(): Promise<any> {
  // TODO: get all pages
  const signers = await poxRewardsApi.getBurnchainRewardList({});
  return signers.results;
}

export async function getSignerStackers(cycleNumber: number, signerKey: string): Promise<any> {
  // TODO: get all pages
  const stackers = await poxApi.getPoxCycleSignerStackers({
    cycleNumber: cycleNumber,
    signerKey: signerKey,
  });
  return stackers.results;
}
