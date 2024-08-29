import { AccountsApi } from '@stacks/blockchain-api-client';
import { configuration } from './constants';

const accountsApi = new AccountsApi(configuration);

export async function getBalances(address: string): Promise<any> {
  const result = await accountsApi.getAccountBalance({ principal: address });
  return result;
}
