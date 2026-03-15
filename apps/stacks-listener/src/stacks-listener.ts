import { createClient } from "@stacks/blockchain-api-client";

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { StacksListener } from "./app";

dotenv.config();

const port = process.env.PORT || 3000;
const queue = process.env.QUEUE_URL;

const app: Express = express();
const client = createClient({
  baseUrl: "https://api.mainnet.hiro.so",
});

app.use(express.json());

app.get("/health", (_: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.post("/block", async (req: Request, res: Response) => {
  console.log("[server] received block from API request");

  try {
    const body = req.body as { block_height: number };
    const { data: block } = await client.GET("/extended/v2/blocks/{height_or_hash}", {
      params: {
        path: { height_or_hash: body.block_height },
      },
    });

    if (!block) {
      res.status(404).json({ success: false, error: "Block not found" });
      return;
    }

    await stacks.sendBlock(block);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
});

let stacks: StacksListener;

const server = app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  stacks = await StacksListener.create(queue);
});

function shutdown() {
  stacks?.dispose();
  server.close();
  process.exit();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
