import type { Context, SQSEvent } from "aws-lambda";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import type { NakamotoBlock } from "@stacks/blockchain-api-client";
import * as db from "@repo/database/src/actions";

const sns = new SNSClient();

export async function processBlock(event: SQSEvent, _: Context): Promise<void> {
  for (const record of event.Records) {
    const latest_block = (await JSON.parse(record.body)) as NakamotoBlock;
    console.log(`Processing block ${latest_block.height}`);
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);

    const latestBlock = await db.getLatestBlock();
    console.log("Latest Block", latestBlock);

    const addResult = await db.saveBlock(latest_block.height);
    console.log("Add result:", addResult);

    const responseSigners = await sns.send(
      new PublishCommand({
        TopicArn: process.env.TOPIC_SIGNERS,
        Message: latest_block.height.toString(),
      })
    );

    console.log(
      `Published message ${responseSigners.MessageId} to topic ${process.env.TOPIC_SIGNERS}`
    );

    const responseRewards = await sns.send(
      new PublishCommand({
        TopicArn: process.env.TOPIC_REWARDS,
        Message: latest_block.height.toString(),
      })
    );

    console.log(
      `Published message ${responseRewards.MessageId} to topic ${process.env.TOPIC_REWARDS}`
    );
  }
}
