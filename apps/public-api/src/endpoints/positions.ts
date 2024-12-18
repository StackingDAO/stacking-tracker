import { Router, Request, Response } from "express";
import {
  getPoxPositions,
  getPoxUserPositions,
} from "../helpers/positionsHelpers";
import { isValidStacksAddress } from "@repo/stacks";

const router = Router();

router
  .get("/", async (req: Request, res: Response) => {
    const result = await getPoxPositions();
    res.send(result);
  })

  .get("/:wallet", async (req: Request, res: Response) => {
    const { wallet } = req.params;

    if (!isValidStacksAddress(wallet)) {
      return res.status(400).send("Invalid wallet address");
    }

    const result = await getPoxUserPositions(wallet);
    res.send(result);
  });

export default router;
