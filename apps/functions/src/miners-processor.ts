import { getBlock } from "@repo/stacks/src/blocks";
import { getTransactionsByBlockHeight } from "@repo/stacks/src/transactions";
import { getMinerRewards } from "@repo/stacks/src/mining";
import { getAddressTransactions } from "@repo/bitcoin/src/address";
import { getTransaction } from "@repo/bitcoin/src/transactions";

import type { Context, SNSEvent } from "aws-lambda";
import {
  getMiners,
  getMinersFirstBlockHeight,
  getMinersLastBlockHeight,
  getMinersBidsFirstBlockHeight,
  getMinersBidsLastBlockHeight,
  saveMiner,
  saveMinerBids,
} from "@repo/database";

function blocksToProcess(
  eventBlockHeight: number,
  dbFirstBlockHeight: number,
  dbLastBlockHeight: number
) {
  const maxBlocks = 24;

  const firstBlockHeight =
    dbFirstBlockHeight === 0 ? eventBlockHeight : dbFirstBlockHeight;
  const lastBlockHeight =
    dbLastBlockHeight === 0 ? eventBlockHeight : dbLastBlockHeight;

  let blockHeightsToProcess: number[] = [];

  for (
    let blockHeight = lastBlockHeight + 1;
    blockHeight < lastBlockHeight + maxBlocks;
    blockHeight++
  ) {
    if (
      blockHeightsToProcess.length < maxBlocks &&
      blockHeight <= eventBlockHeight
    ) {
      blockHeightsToProcess.push(blockHeight);
    }
  }

  for (
    let blockHeight = firstBlockHeight - 1;
    blockHeight > firstBlockHeight - maxBlocks;
    blockHeight--
  ) {
    if (blockHeightsToProcess.length < maxBlocks) {
      blockHeightsToProcess.push(blockHeight);
    }
  }

  return blockHeightsToProcess;
}

//
// Miner for block
//

async function processMinerForBlock(blockHeight: number) {
  const blockInfo = await getBlock(blockHeight);

  const transactions = await getTransactionsByBlockHeight(blockHeight);
  const feeArray = transactions.map((tx: any) => tx.fee_rate / 1000000.0);
  const totalTxFees = feeArray.reduce(
    (acc: number, current: number) => acc + current,
    0
  );

  const blockTransaction = await getTransaction(
    blockInfo.miner_txid.replace("0x", "")
  );
  const startAddress = blockTransaction.inputs[0].addresses[0];

  const minerFees = getMinerRewards(blockHeight);
  await saveMiner(blockHeight, startAddress, minerFees, totalTxFees);
}

async function processMinersHelper(eventBlockHeight: number) {
  const minersFirstBlockHeight = await getMinersFirstBlockHeight();
  const minersLastBlockHeight = await getMinersLastBlockHeight();

  const blocks = blocksToProcess(
    eventBlockHeight,
    minersFirstBlockHeight,
    minersLastBlockHeight
  );

  console.log("Process miners for blocks:", blocks);

  for (const block of blocks) {
    await processMinerForBlock(block);
  }
}

//
// Miner bids
//

function getBidFromOutputs(outputs: any) {
  const values = outputs.map((output: any) => output.value);

  let valueOccurences = values.reduce(
    (acc: { [x: string]: any }, num: string | number) => {
      acc[num] = (acc[num] || 0) + 1;
      return acc;
    },
    {}
  );

  let bid = Object.keys(valueOccurences)
    .filter((key) => valueOccurences[key] === 2)
    .map(Number);

  if (bid.length === 0) {
    return 0;
  }
  return bid[0];
}

async function processBidsForBlock(blockHeight: number) {
  const miners = await getMiners(blockHeight - 300, blockHeight);

  console.log("Active miners for bids", miners.length);

  if (miners.length < 288) {
    return;
  }

  const minerAddresses = [
    ...new Set(miners.map((miner: any) => miner.bitcoinAddress)),
  ];

  const blockInfo = await getBlock(blockHeight);

  for (const minerAddress of minerAddresses) {
    const transactionsInfo = await getAddressTransactions(
      minerAddress as string,
      blockInfo.burn_block_height,
      blockInfo.burn_block_height + 1
    );

    if (transactionsInfo.txs.length > 0) {
      const transaction = transactionsInfo.txs[0];
      const bid = getBidFromOutputs(transaction.outputs);
      if (bid > 0) {
        await saveMinerBids(
          blockHeight,
          minerAddress as string,
          bid / 100000000.0
        );
      }
    }
  }
}

async function processMinersBidsHelper(eventBlockHeight: number) {
  const minersFirstBlockHeight = await getMinersBidsFirstBlockHeight();
  const minersLastBlockHeight = await getMinersBidsLastBlockHeight();

  const blocks = blocksToProcess(
    eventBlockHeight,
    minersFirstBlockHeight,
    minersLastBlockHeight
  );

  console.log("Process miner bids for blocks:", blocks);

  for (const block of blocks) {
    await processBidsForBlock(block);
  }
}

//
// Main
//

export async function processMiners(
  event: SNSEvent,
  __: Context
): Promise<void> {
  const eventBody = await JSON.parse(event.Records[0].Sns.Message);
  const eventBlockHeight = eventBody.block_height;

  try {
    // Process miners who won
    await processMinersHelper(eventBlockHeight);

    // Process bids
    await processMinersBidsHelper(eventBlockHeight);
  } catch (error) {
    console.log("STOPPED WITH ERROR", error);
  }
}
