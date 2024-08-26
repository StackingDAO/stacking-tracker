import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import routerPox from "./endpoints/pox";
import routerSigners from "./endpoints/signers";
import routerMiners from "./endpoints/miners";
import routerPools from "./endpoints/pools";
import routerPoolDetails from "./endpoints/pool";

dotenv.config();

const port = process.env.PORT || 3030;

const app: Express = express();

app.use(express.json());

app.get("/health", (_: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use("/pox", routerPox);
app.use("/signers", routerSigners);
app.use("/miners", routerMiners);
app.use("/pools", routerPools);
app.use("/pool", routerPoolDetails);

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

function shutdown() {
  server.close();
  process.exit();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
