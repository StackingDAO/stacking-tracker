import { getBlock } from "@repo/stacks/src/blocks";
import { getTransactionsByBlockHeight } from "@repo/stacks/src/transactions";
import { getAddressTransactions } from "@repo/bitcoin/src/address";
import { getTransaction } from "@repo/bitcoin/src/transactions";

import type { Context, SNSEvent } from "aws-lambda";
import { saveMiner } from "@repo/database";

function processBitcoinTransaction(transaction: any) {
  // TODO: double check
  const outputs = transaction.outputs.filter(
    (output: any) => output.script_type === "pay-to-witness-pubkey-hash"
  );

  const values = outputs.map((output: any) => output.value);

  let valueOccurences = values.reduce(
    (acc: { [x: string]: any }, num: string | number) => {
      acc[num] = (acc[num] || 0) + 1;
      return acc;
    },
    {}
  );

  let bid = Object.keys(valueOccurences)
    .filter((key) => valueOccurences[key] >= 2)
    .map(Number);

  if (bid.length === 0) {
    return undefined;
  }

  const addresses = outputs
    .map((output: any) => output.addresses)
    .flat()
    .filter((address: string) => address !== null);

  return { bid: bid[0], addresses: addresses };
}

async function processAllMiners(startAddress: string, blockHeight: number) {
  let result: any[] = [];

  let addressesFetched: string[] = [];
  let addressesToFetch: string[] = [startAddress];

  while (addressesToFetch.length > 0) {
    const address = addressesToFetch[0];

    const transactionsInfo = await getAddressTransactions(
      address,
      blockHeight,
      blockHeight + 1
    );

    const transactions = transactionsInfo.txs.filter(
      (tx: any) => tx.block_height !== -1
    );

    console.log("txs length", address, transactions);

    // TODO: how can this be?
    if (transactions.length > 0) {
      // TODO: find correct tx if multiple
      const txInfo = processBitcoinTransaction(transactions.txs[0]);

      result.push({
        address: address,
        bid: txInfo.bid,
      });

      for (const address of txInfo.addresses) {
        if (
          !addressesFetched.includes(address) &&
          !addressesToFetch.includes(address)
        ) {
          addressesToFetch.push(address);
        }
      }
    }

    addressesToFetch = addressesToFetch.slice(1);
    addressesFetched.push(address);
  }

  return result;
}

export async function processMiners(
  event: SNSEvent,
  __: Context
): Promise<void> {
  const eventBody = await JSON.parse(event.Records[0].Sns.Message);
  const eventBlockHeight = eventBody.block_height;

  const blockInfo = await getBlock(eventBlockHeight);

  const transactions = await getTransactionsByBlockHeight(eventBlockHeight);
  const feeArray = transactions.map((tx: any) => tx.fee_rate / 1000000.0);
  const feesTotal = feeArray.reduce(
    (acc: number, current: number) => acc + current,
    0
  );

  const blockTransaction = await getTransaction(
    blockInfo.miner_txid.replace("0x", "")
  );

  const startAddress = blockTransaction.inputs[0].addresses[0];

  // TODO: calculate STX miner fees
  // Docs: https://docs.stacks.co/stacks-101/mining
  await saveMiner(eventBlockHeight, startAddress, 0, feesTotal);

  const minersInfo = await processAllMiners(
    startAddress,
    blockInfo.burn_block_height
  );

  console.log("block height", eventBlockHeight);
  console.log("block mined by", startAddress);
  console.log("block fees stx", feesTotal);
  console.log("miners bids", minersInfo);
}
