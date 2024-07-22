import axios from 'axios';
import { baseUrl } from './constants';

export async function getAddressTransactions(
  address: string,
  afterBlock: number,
  beforeBlock: number
): Promise<any> {
  const path = `${baseUrl}/v1/btc/main/addrs/${address}/full?after=${afterBlock}&before=${beforeBlock}`;
  console.log('path', path);
  const data = (await axios.get(path)).data;
  return data;
}
