import type { Context, SQSEvent } from "aws-lambda";
import type { NakamotoBlock } from "@stacks/blockchain-api-client";

export async function processBlock(event: SQSEvent, _: Context): Promise<void> {
  for (const record of event.Records) {
    const latest_block = (await JSON.parse(record.body)) as NakamotoBlock;
    console.log(`Processing block ${latest_block.height}`);
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
  }
}
