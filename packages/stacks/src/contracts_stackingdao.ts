import {
  cvToJSON,
  callReadOnlyFunction,
  contractPrincipalCV,
  standardPrincipalCV,
  uintCV,
} from '@stacks/transactions';
import { network } from './constants';

export async function getStxPerStStx(): Promise<any> {
  const readResult = await callReadOnlyFunction({
    contractAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    contractName: 'data-core-v2',
    functionName: 'get-stx-per-ststx',
    functionArgs: [contractPrincipalCV('SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG', 'reserve-v1')],
    senderAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    network: network,
  });

  const result = cvToJSON(readResult);
  return result.value.value / 1000000.0;
}

export async function getStStxBtcSupply(): Promise<any> {
  const readResult = await callReadOnlyFunction({
    contractAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    contractName: 'ststxbtc-token',
    functionName: 'get-total-supply',
    functionArgs: [],
    senderAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
    network: network,
  });

  const result = cvToJSON(readResult);
  return result.value.value / 1000000.0;
}

export async function getStStxBtcSupplyAtBlock(block: number): Promise<any> {
  try {
    const readResult = await callReadOnlyFunction({
      contractAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
      contractName: 'ststxbtc-helper-v1',
      functionName: 'get-ststxbtc-total-supply',
      functionArgs: [uintCV(block)],
      senderAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
      network: network,
    });

    const result = cvToJSON(readResult);
    return result.value.value / 1000000.0;
  } catch (error) {
    return 0.0;
  }
}

export async function getProtocolStStxBalance(
  address: string,
  protocolContract: string
): Promise<any> {
  try {
    const readResult = await callReadOnlyFunction({
      contractAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
      contractName: protocolContract,
      functionName: 'get-balance',
      functionArgs: [standardPrincipalCV(address)],
      senderAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
      network: network,
    });

    const result = cvToJSON(readResult);
    return result.value.value / 1000000.0;
  } catch (error) {
    return 0;
  }
}

export async function getProtocolStStxBtcBalance(
  address: string,
  protocolContract: string
): Promise<any> {
  try {
    const readResult = await callReadOnlyFunction({
      contractAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
      contractName: protocolContract,
      functionName: 'get-holder-balance',
      functionArgs: [standardPrincipalCV(address)],
      senderAddress: 'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG',
      network: network,
    });

    const result = cvToJSON(readResult);
    return result.value.value / 1000000.0;
  } catch (error) {
    return 0;
  }
}
