import axios from 'axios';
import { baseUrl } from './constants';

export async function getTransaction(hash: string): Promise<any> {
  const path = `${baseUrl}/v1/btc/main/txs/${hash}`;
  const data = (await axios.get(path)).data;
  return data;
}
