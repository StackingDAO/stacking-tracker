import { get } from './api';

export async function getTransaction(hash: string): Promise<any> {
  const path = `/v1/btc/main/txs/${hash}`;
  const data = await get(path);
  return data;
}
