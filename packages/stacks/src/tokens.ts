import { cvToJSON, callReadOnlyFunction } from '@stacks/transactions';
import { network } from './constants';

export async function getDecimals(tokenAddress: string): Promise<any> {
  const readResult = await callReadOnlyFunction({
    contractAddress: tokenAddress.split('.')[0],
    contractName: tokenAddress.split('.')[1],
    functionName: 'get-decimals',
    functionArgs: [],
    senderAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    network: network,
  });

  const result = cvToJSON(readResult);
  return result.value.value;
}

export async function getTotalSupply(tokenAddress: string): Promise<any> {
  const decimals = await getDecimals(tokenAddress);

  const readResult = await callReadOnlyFunction({
    contractAddress: tokenAddress.split('.')[0],
    contractName: tokenAddress.split('.')[1],
    functionName: 'get-total-supply',
    functionArgs: [],
    senderAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    network: network,
  });

  const result = cvToJSON(readResult);
  return parseFloat(result.value.value) / Math.pow(10, decimals);
}
