import { cvToJSON, callReadOnlyFunction, standardPrincipalCV } from '@stacks/transactions';
import { network } from './constants';

export async function getDelegationInfo(address: string): Promise<any> {
  const readResult = await callReadOnlyFunction({
    contractAddress: 'SP000000000000000000002Q6VF78',
    contractName: 'pox-4',
    functionName: 'get-delegation-info',
    functionArgs: [standardPrincipalCV(address)],
    senderAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    network: network,
  });

  const result = cvToJSON(readResult);
  return result.value?.value;
}

export async function getStackerInfo(address: string): Promise<any> {
  const readResult = await callReadOnlyFunction({
    contractAddress: 'SP000000000000000000002Q6VF78',
    contractName: 'pox-4',
    functionName: 'get-stacker-info',
    functionArgs: [standardPrincipalCV(address)],
    senderAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    network: network,
  });

  const result = cvToJSON(readResult);
  return result.value?.value;
}
