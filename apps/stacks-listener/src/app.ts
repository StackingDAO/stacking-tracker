import type { Block } from "@stacks/stacks-blockchain-api-types";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import * as stacks from "@stacks/blockchain-api-client";
import { io, Socket } from "socket.io-client";

export class StacksListener {
  sqs: SQSClient;
  queueUrl: string;
  _socket: Socket;
  listener: stacks.StacksApiSocketClient;
  private readonly unsubscribeBlocks: () => void;

  constructor(queueUrl: string) {
    this.sqs = new SQSClient({
      region: "eu-central-1",
    });
    this.queueUrl = queueUrl;

    this._socket = io("https://api.mainnet.hiro.so/", {
      transports: ["websocket"],
    });
    this._socket.on("connect", () =>
      console.log("socket connected: listening for confirmed blocks...")
    );
    this._socket.on("disconnect", () => console.log("socket disconnected"));
    this._socket.on("connect_error", (err) =>
      console.log("connection error: ", err)
    );

    this.listener = new stacks.StacksApiSocketClient(this._socket);

    const { unsubscribe } = this.listener.subscribeBlocks(
      this.sendBlock.bind(this)
    );
    this.unsubscribeBlocks = unsubscribe;
  }

  dispose() {
    console.log("closing all websocket connections");

    this.unsubscribeBlocks();
    this._socket.close();
  }

  async sendBlock(block: Block) {
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
        })
      );

      console.log(`Published message ${response.MessageId} to queue.`);
    } catch (e) {
      console.error(e);
      console.error("failed to put block on queue: ", block.hash);
    }
  }
}
