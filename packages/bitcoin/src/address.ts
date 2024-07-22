import { get } from './api';

export async function getAddressTransactions(
  address: string,
  afterBlock: number,
  beforeBlock: number
): Promise<any> {
  const path = `/v1/btc/main/addrs/${address}/full?after=${afterBlock}&before=${beforeBlock}`;
  const data = await get(path);
  return data;
}
