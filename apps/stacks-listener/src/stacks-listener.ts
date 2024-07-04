import { BlocksApi } from "@stacks/blockchain-api-client";

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { StacksListener } from "./app";

dotenv.config();

const port = process.env.PORT || 3000;
const queue = process.env.QUEUE_URL;

const app: Express = express();
const blocks = new BlocksApi();
const stacks = new StacksListener(queue);

app.use(express.json());

app.get("/health", (_: Request, res: Response) => {
  if (stacks.listener.socket.connected) res.status(200).json({ status: "ok" });
  else res.status(500).json({ status: "disconnected" });
});

app.post("/block", async (req: Request, res: Response) => {
  console.log("[server] received block from API request");

  try {
    const body = req.body as { block_height: number };
    const block = await blocks.getBlockByHeight({
      height: body.block_height,
    });

    await stacks.sendBlock(block);

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
});

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

function shutdown() {
  stacks.dispose();
  server.close();
  process.exit();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
