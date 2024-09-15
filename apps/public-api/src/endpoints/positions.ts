import { Router, Request, Response } from "express";
import {
  getPoxPositions,
  getPoxUserPositions,
} from "../helpers/positionsHelpers";

const router = Router();

router
  .get("/", async (req: Request, res: Response) => {
    const result = await getPoxPositions();
    res.send(result);
  })

  .get("/:wallet", async (req: Request, res: Response) => {
    const { wallet } = req.params;

    const result = await getPoxUserPositions(wallet);
    res.send(result);
  });

export default router;
