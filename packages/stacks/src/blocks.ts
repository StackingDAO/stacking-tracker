import { BlocksApi } from '@stacks/blockchain-api-client';
import { configuration } from './constants';

const blocksApi = new BlocksApi(configuration);

export async function getBlocks(maxPages: number, offset: number = 0): Promise<any> {
  let result: any[] = [];
  let pageCounter = 0;

  while (pageCounter < maxPages) {
    const blocks = await blocksApi.getBlocks({ limit: 30, offset: offset + result.length });
    result = result.concat(blocks.results);

    pageCounter++;
  }

  return result;
}

export async function getBlock(blockHeight: number): Promise<any> {
  const block = await blocksApi.getBlock({ heightOrHash: blockHeight });
  return block;
}
