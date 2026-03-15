import { stacksApi } from './constants';
import { validateStacksAddress } from '@stacks/transactions';

export async function getBalances(address: string): Promise<any> {
  const { data } = await stacksApi.get(`/extended/v1/address/${address}/balances`);
  return data;
}

export function isValidStacksAddress(address: string) {
  return validateStacksAddress(address);
}
