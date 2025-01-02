import express, { Express, Request, Response } from "express";
import cors from "cors";

import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

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

app.use("/telegram", routerTelegram);
app.use("/user", routerUser);
app.use("/positions", routerPositions);
app.use("/pox", routerPox);
app.use("/signers", routerSigners);
app.use("/signer", routerSigner);
app.use("/miners", routerMiners);
app.use("/pools", routerPools);
app.use("/pool", routerPoolDetails);
app.use("/tokens", routerTokens);
app.use("/token", routerToken);

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

function shutdown() {
  server.close();
  process.exit();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
