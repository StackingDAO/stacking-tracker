import { stacksApi } from './constants';

export async function getBlocks(maxPages: number, offset: number = 0): Promise<any> {
  let result: any[] = [];
  let pageCounter = 0;

  while (pageCounter < maxPages) {
    const { data } = await stacksApi.get(
      `/extended/v2/blocks?limit=30&offset=${offset + result.length}`
    );
    result = result.concat(data.results);

    pageCounter++;
  }

  return result;
}

export async function getBlock(blockHeight: number): Promise<any> {
  const { data } = await stacksApi.get(`/extended/v2/blocks/${blockHeight}`);
  return data;
}

export async function getBurnBlockByHeight(burnBlockHeight: number): Promise<any> {
  try {
    const { data } = await stacksApi.get(
      `/extended/v1/block/by_burn_block_height/${burnBlockHeight}`
    );
    return data;
  } catch (error) {
    return await getBurnBlockByHeight(burnBlockHeight + 1);
  }
}

export async function getBlockByBurnHeight(burnBlockHeight: number): Promise<any> {
  try {
    const { data } = await stacksApi.get(
      `/extended/v2/burn-blocks/${burnBlockHeight}/blocks`
    );
    return data;
  } catch (error) {
    return await getBlockByBurnHeight(burnBlockHeight + 1);
  }
}
