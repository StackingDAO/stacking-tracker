import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import {
  connectWebSocketClient,
  StacksApiWebSocketClient,
} from "@stacks/blockchain-api-client";

const HIRO_WS_URL = "wss://api.mainnet.hiro.so/";

export interface BlockMessage {
  height: number;
  hash: string;
  [key: string]: unknown;
}

export class StacksListener {
  sqs: SQSClient;
  queueUrl: string;
  client: StacksApiWebSocketClient;

  private constructor(
    queueUrl: string,
    client: StacksApiWebSocketClient,
  ) {
    this.sqs = new SQSClient({ region: "eu-central-1" });
    this.queueUrl = queueUrl;
    this.client = client;
  }

  static async create(queueUrl: string): Promise<StacksListener> {
    const client = await connectWebSocketClient(HIRO_WS_URL);
    console.log("websocket connected: listening for confirmed blocks...");

    const listener = new StacksListener(queueUrl, client);
    await client.subscribeBlocks(listener.sendBlock.bind(listener));
    return listener;
  }

  dispose() {
    console.log("closing all websocket connections");
    this.client.webSocket.close();
  }

  async sendBlock(block: BlockMessage) {
    console.log("Received block ", block.height);

    try {
      const response = await this.sqs.send(
        new SendMessageCommand({
          QueueUrl: this.queueUrl,
          MessageDeduplicationId: block.hash,
          MessageGroupId: "stacks-listener",
          MessageAttributes: {
            Publisher: {
              DataType: "String",
              StringValue: "stacks-listener",
            },
          },
          MessageBody: JSON.stringify(block),
        }),
      );

      console.log(`Published message ${response.MessageId} to queue.`);
    } catch (e) {
      console.error(e);
      console.error("failed to put block on queue: ", block.hash);
    }
  }
}
