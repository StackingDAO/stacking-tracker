import { BlocksApi } from '@stacks/blockchain-api-client';
import { apiUrl, configuration } from './constants';
import axios from 'axios';

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

// export async function getBlockByBurnHeight(burnBlockHeight: number): Promise<any> {
//   const block = await blocksApi.getBlockByBurnBlockHeight({ burnBlockHeight: burnBlockHeight });
//   return block;
// }

export async function getBlockByBurnHeight(burnBlockHeight: number): Promise<any> {
  try {
    const path = `${apiUrl}/extended/v2/burn-blocks/${burnBlockHeight}/blocks`;
    const data = (await axios.get(path)).data;
    return data;
  } catch (error) {
    return await getBlockByBurnHeight(burnBlockHeight + 1);
  }
}
