import type { Context, SQSEvent } from "aws-lambda";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import type { NakamotoBlock } from "@stacks/blockchain-api-client";

const sns = new SNSClient();

export async function processBlock(event: SQSEvent, _: Context): Promise<void> {
  for (const record of event.Records) {
    const latest_block = (await JSON.parse(record.body)) as NakamotoBlock;

    if (latest_block.height % 60 !== 0) {
      return;
    }

    console.log(`Processing block ${latest_block.height}`);

    const responseSigners = await sns.send(
      new PublishCommand({
        TopicArn: process.env.TOPIC_SIGNERS,
        Message: JSON.stringify({ block_height: latest_block.height }),
      })
    );

    console.log(
      `Published message ${responseSigners.MessageId} to topic ${process.env.TOPIC_SIGNERS}`
    );

    const responseRewards = await sns.send(
      new PublishCommand({
        TopicArn: process.env.TOPIC_REWARDS,
        Message: JSON.stringify({ block_height: latest_block.height }),
      })
    );

    console.log(
      `Published message ${responseRewards.MessageId} to topic ${process.env.TOPIC_REWARDS}`
    );

    const responseStackersRewards = await sns.send(
      new PublishCommand({
        TopicArn: process.env.TOPIC_STACKERS_REWARDS,
        Message: JSON.stringify({ block_height: latest_block.height }),
      })
    );

    console.log(
      `Published message ${responseStackersRewards.MessageId} to topic ${process.env.TOPIC_STACKERS_REWARDS}`
    );

    const responseMiners = await sns.send(
      new PublishCommand({
        TopicArn: process.env.TOPIC_MINERS,
        Message: JSON.stringify({ block_height: latest_block.height }),
      })
    );

    console.log(
      `Published message ${responseMiners.MessageId} to topic ${process.env.TOPIC_MINERS}`
    );

    const responseTelegram = await sns.send(
      new PublishCommand({
        TopicArn: process.env.TOPIC_TELEGRAM,
        Message: JSON.stringify({ block_height: latest_block.height }),
      })
    );

    console.log(
      `Published message ${responseTelegram.MessageId} to topic ${process.env.TOPIC_TELEGRAM}`
    );

    const responsePrices = await sns.send(
      new PublishCommand({
        TopicArn: process.env.TOPIC_PRICES,
        Message: JSON.stringify({ block_height: latest_block.height }),
      })
    );

    console.log(
      `Published message ${responsePrices.MessageId} to topic ${process.env.TOPIC_PRICES}`
    );
  }
}
