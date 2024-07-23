import axios from 'axios';
import { apiUrl } from './constants';

// The package '@stacks/blockchain-api-client'
// does not include 'limit' and 'offset' parameters
export class StacksExtended {
  async getPoxCycleSigners(cycle: number, limit: number = 250, offset: number = 0) {
    const path = `${apiUrl}/extended/v2/pox/cycles/${cycle}/signers?limit=${limit}&offset=${offset}`;
    const data = (await axios.get(path)).data;
    return data;
  }

  async getStackersForSignerInCycle(
    signer: string,
    cycle: number,
    limit: number = 250,
    offset: number = 0
  ) {
    const path = `${apiUrl}/extended/v2/pox/cycles/${cycle}/signers/${signer}/stackers?limit=${limit}&offset=${offset}`;
    const data = (await axios.get(path)).data;
    return data;
  }
}
