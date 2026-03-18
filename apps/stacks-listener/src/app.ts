import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import {
  connectWebSocketClient,
  StacksApiWebSocketClient,
} from "@stacks/blockchain-api-client";

const HIRO_WS_URL = "wss://api.mainnet.hiro.so/";
const MAX_BLOCK_IDLE_MS = 2 * 60 * 1000; // Restart if websocket stops delivering blocks
const STALE_CHECK_INTERVAL_MS = 30 * 1000;

export interface BlockMessage {
  height: number;
  hash: string;
  [key: string]: unknown;
}

export class StacksListener {
  sqs: SQSClient;
  queueUrl: string;
  client: StacksApiWebSocketClient;

  private lastBlockReceivedAt = Date.now();
  private staleCheckInterval?: NodeJS.Timeout;
  private restarting = false;

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
    listener.attachWebSocketDebugEvents();
    listener.startStaleBlockWatchdog();

    try {
      await client.subscribeBlocks(listener.sendBlock.bind(listener));
    } catch (e) {
      console.error("[stacks-listener] subscribeBlocks failed", e);
      listener.dispose();
      throw e;
    }
    return listener;
  }

  private attachWebSocketDebugEvents() {
    // The websocket client shape depends on the underlying implementation
    // (native WebSocket vs ws vs something wrapped). We attach handlers best-effort.
    const ws: any = (this.client as any).webSocket;
    if (!ws) return;

    const logPrefix = "[stacks-listener] websocket";

    if (typeof ws.on === "function") {
      ws.on("open", () => console.log(`${logPrefix} open`));
      ws.on("close", (code: any, reason: any) => {
        console.error(`${logPrefix} close code=${code} reason=${reason}`);
      });
      ws.on("error", (err: any) => {
        console.error(`${logPrefix} error`, err);
      });
      return;
    }

    if (typeof ws.addEventListener === "function") {
      ws.addEventListener("open", () => console.log(`${logPrefix} open`));
      ws.addEventListener("close", (event: any) => {
        const code = event?.code ?? "unknown";
        const reason = event?.reason ?? "unknown";
        console.error(`${logPrefix} close code=${code} reason=${reason}`);
      });
      ws.addEventListener("error", (event: any) => {
        console.error(`${logPrefix} error`, event);
      });
    }
  }

  private startStaleBlockWatchdog() {
    // If the websocket silently stops delivering blocks, we restart.
    // This avoids "task still RUNNING but listener effectively dead".
    this.staleCheckInterval = setInterval(() => {
      if (this.restarting) return;

      const idleMs = Date.now() - this.lastBlockReceivedAt;
      if (idleMs > MAX_BLOCK_IDLE_MS) {
        this.restarting = true;
        console.error(
          `[stacks-listener] no blocks received for ${Math.round(
            idleMs / 1000,
          )}s; restarting listener process`,
        );

        try {
          this.client.webSocket.close();
        } catch {
          // ignore close errors; we will restart anyway
        }

        if (this.staleCheckInterval) clearInterval(this.staleCheckInterval);
        process.exit(1);
      }
    }, STALE_CHECK_INTERVAL_MS);
  }

  dispose() {
    console.log("closing all websocket connections");
    if (this.staleCheckInterval) clearInterval(this.staleCheckInterval);
    this.client.webSocket.close();
  }

  async sendBlock(block: BlockMessage) {
    this.lastBlockReceivedAt = Date.now();
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
