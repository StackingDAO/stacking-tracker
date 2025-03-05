import { BlocksApi, TransactionsApi } from '@stacks/blockchain-api-client';
import { configuration } from './constants';
import { cvToJSON, deserializeCV } from '@stacks/transactions';

const transactionsApi = new TransactionsApi(configuration);

export async function getTransactionsByBlockHeight(blockHeight: number): Promise<any> {
  let result: any[] = [];
  let hasReachedEndBlock = false;

  while (!hasReachedEndBlock) {
    const transactions = await transactionsApi.getTransactionsByBlockHeight({
      height: blockHeight,
      limit: 50,
      offset: result.length,
    });
    result = result.concat(transactions.results);

    hasReachedEndBlock = transactions.results.length === 0;
  }

  return result;
}

export async function getTransactionById(txId: string): Promise<any> {
  return await transactionsApi.getTransactionById({
    txId: txId,
  });
}

export async function getAddressTransactions(address: string): Promise<any> {
  return await transactionsApi.getAddressTransactions({
    address: address,
    limit: 50,
    offset: 0,
  });
}

export function reprHexToJson(reprHex: string) {
  const buffer = Buffer.from(reprHex.substring(2), 'hex');
  const clarityValue = deserializeCV(buffer);
  const jsonValue = cvToJSON(clarityValue);
  return jsonValue;
}
