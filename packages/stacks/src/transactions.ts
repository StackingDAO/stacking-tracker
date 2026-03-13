import { stacksApi } from './constants';
import { cvToJSON, deserializeCV } from '@stacks/transactions';

export async function getTransactionsByBlockHeight(blockHeight: number): Promise<any> {
  let result: any[] = [];
  let hasReachedEndBlock = false;

  while (!hasReachedEndBlock) {
    const { data } = await stacksApi.get(
      `/extended/v1/tx/block_height/${blockHeight}?limit=50&offset=${result.length}`
    );
    result = result.concat(data.results);

    hasReachedEndBlock = data.results.length === 0;
  }

  return result;
}

export async function getTransactionById(txId: string): Promise<any> {
  const { data } = await stacksApi.get(`/extended/v1/tx/${txId}`);
  return data;
}

export async function getAddressTransactions(address: string): Promise<any> {
  const { data } = await stacksApi.get(
    `/extended/v2/addresses/${address}/transactions?limit=50&offset=0`
  );
  return data;
}

export function reprHexToJson(reprHex: string) {
  const buffer = Buffer.from(reprHex.substring(2), 'hex');
  const clarityValue = deserializeCV(buffer);
  const jsonValue = cvToJSON(clarityValue);
  return jsonValue;
}
