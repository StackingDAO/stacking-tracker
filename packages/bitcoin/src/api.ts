import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const baseUrl = 'https://api.blockcypher.com';

export async function get(path: string): Promise<any> {
  const fullPath = `${baseUrl}${path}${path.includes('?') ? '&' : '?'}token=${process.env.BLOCKCYPHER_TOKEN}`;
  const data = (await axios.get(fullPath)).data;
  return data;
}
