import { stacksApi } from './constants';

export async function getPox(): Promise<any> {
  const { data } = await stacksApi.get('/v2/pox');
  return data;
}

export async function getCurrentCycle(): Promise<number> {
  const { data } = await stacksApi.get('/extended/v2/pox/cycles?limit=1');
  return data.results[0].cycle_number;
}

export async function getCycles(): Promise<any> {
  let result: any[] = [];
  let hasReachedEndBlock = false;

  while (!hasReachedEndBlock) {
    const { data } = await stacksApi.get(
      `/extended/v2/pox/cycles?limit=60&offset=${result.length}`
    );
    result = result.concat(data.results);
    hasReachedEndBlock = data.results.length < 60;
  }

  return result;
}

export async function getCycleSigners(cycleNumber: number): Promise<any> {
  let result: any[] = [];
  let hasReachedEndBlock = false;

  while (!hasReachedEndBlock) {
    const { data } = await stacksApi.get(
      `/extended/v2/pox/cycles/${cycleNumber}/signers?limit=250&offset=${result.length}`
    );
    result = result.concat(data.results);
    hasReachedEndBlock = data.results.length < 250;
  }

  return result;
}

export async function getCycleSigner(cycleNumber: number, signerKey: string): Promise<any> {
  const { data } = await stacksApi.get(
    `/extended/v2/pox/cycles/${cycleNumber}/signers/${signerKey}`
  );
  return data;
}

export async function getSignerStackers(cycleNumber: number, signerKey: string): Promise<any> {
  let result: any[] = [];
  let hasReachedEndBlock = false;

  while (!hasReachedEndBlock) {
    const { data } = await stacksApi.get(
      `/extended/v2/pox/cycles/${cycleNumber}/signers/${signerKey}/stackers?limit=200&offset=${result.length}`
    );
    result = result.concat(data.results);
    hasReachedEndBlock = data.results.length < 200;
  }

  return result;
}

// Rewards are an endless list, newest rewards first
// The `burnBlockEnd` param sets a limit on how far to go in the list
// The list is capped to a max
export async function getBurnchainRewards(burnBlockEnd: number, offset: number = 0): Promise<any> {
  let result: any[] = [];
  let hasReachedEndBlock = false;

  while (!hasReachedEndBlock && result.length < 5000) {
    const { data } = await stacksApi.get(
      `/extended/v1/burnchain/rewards?limit=250&offset=${offset + result.length}`
    );
    const filteredResults = data.results.filter(
      (reward: any) => reward.burn_block_height > burnBlockEnd
    );
    result = result.concat(filteredResults);

    hasReachedEndBlock =
      filteredResults.length === 0 || data.results.length !== filteredResults.length;
  }

  return result;
}
