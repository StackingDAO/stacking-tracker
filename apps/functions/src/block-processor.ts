import type { Context, SQSEvent } from "aws-lambda";
import type { NakamotoBlock } from "@stacks/blockchain-api-client";
import * as db from "@repo/database/src/actions";

export async function processBlock(event: SQSEvent, _: Context): Promise<void> {
  for (const record of event.Records) {
    const latest_block = (await JSON.parse(record.body)) as NakamotoBlock;
    console.log(`Processing block ${latest_block.height}`);
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);

    const latestBlock = await db.getLatestBlock();
    console.log("Latest Block", latestBlock);

    const addResult = await db.saveBlock(latest_block.height);
    console.log("Add result:", addResult);
  }
}
