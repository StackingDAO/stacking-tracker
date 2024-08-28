import { cvToJSON, callReadOnlyFunction, contractPrincipalCV } from '@stacks/transactions';
import { network } from './constants';

export async function getLiStxSupply(): Promise<any> {
  const readResult = await callReadOnlyFunction({
    contractAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    contractName: 'ststx-token',
    functionName: 'get-total-supply',
    functionArgs: [],
    senderAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    network: network,
  });

  const result = cvToJSON(readResult);
  return result;
}
