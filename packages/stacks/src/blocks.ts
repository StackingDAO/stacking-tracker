import { BlocksApi } from '@stacks/blockchain-api-client';
import { configuration } from './constants';

const blocksApi = new BlocksApi(configuration);

export async function getBlock(blockHeight: number): Promise<any> {
  const block = await blocksApi.getBlock({ heightOrHash: blockHeight });
  return block;
}
