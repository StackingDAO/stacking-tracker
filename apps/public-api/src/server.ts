import express, { Express, Request, Response } from "express";
import cors from "cors";

import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { cached } from "./cache";
import routerTelegram from "./endpoints/telegram";
import routerUser from "./endpoints/user";
import routerPositions from "./endpoints/positions";
import routerPox from "./endpoints/pox";
import routerSigners from "./endpoints/signers";
import routerSigner from "./endpoints/signer";
import routerMiners from "./endpoints/miners";
import routerPools from "./endpoints/pools";
import routerPoolDetails from "./endpoints/pool";
import routerTokens from "./endpoints/tokens";
import routerToken from "./endpoints/token";

const port = process.env.PORT || 3030;

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use("/telegram", cached(300), routerTelegram);
app.use("/user", cached(300), routerUser);
app.use("/positions", cached(300), routerPositions);
app.use("/pox", cached(3600), routerPox);
app.use("/signers", cached(3600), routerSigners);
app.use("/signer", cached(3600), routerSigner);
app.use("/miners", cached(3600), routerMiners);
app.use("/pools", cached(3600), routerPools);
app.use("/pool", cached(3600), routerPoolDetails);
app.use("/tokens", cached(3600), routerTokens);
app.use("/token", cached(3600), routerToken);

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

function shutdown() {
  server.close();
  process.exit();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
