import { getBlock } from "@repo/stacks/src/blocks";
import { getTransactionsByBlockHeight } from "@repo/stacks/src/transactions";
import { getMinerRewards } from "@repo/stacks/src/mining";
import { getTransaction } from "@repo/bitcoin/src/transactions";

import type { Context, SNSEvent } from "aws-lambda";
import { getMinersFirstBlockHeight, saveMiner } from "@repo/database";

async function processMinersHelper(blockHeight: number) {
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

export async function processMiners(
  event: SNSEvent,
  __: Context
): Promise<void> {
  const eventBody = await JSON.parse(event.Records[0].Sns.Message);
  const eventBlockHeight = eventBody.block_height;

  await processMinersHelper(eventBlockHeight);

  const minersFirstBlockHeight = await getMinersFirstBlockHeight();

  const firstBlockHeight =
    minersFirstBlockHeight === 0
      ? eventBlockHeight - 1
      : minersFirstBlockHeight - 1;

  for (
    let blockHeight = firstBlockHeight;
    blockHeight > firstBlockHeight - 6;
    blockHeight--
  ) {
    await processMinersHelper(blockHeight);
  }
}
