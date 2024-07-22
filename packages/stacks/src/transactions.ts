import { BlocksApi, TransactionsApi } from '@stacks/blockchain-api-client';
import { configuration } from './constants';

const transactionsApi = new TransactionsApi(configuration);

export async function getTransactionsByBlockHeightTest(blockHeight: number): Promise<any> {
  const transactions = await transactionsApi.getTransactionsByBlockHeight({ height: blockHeight });
  return transactions;
}

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
