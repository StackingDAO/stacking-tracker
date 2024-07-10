import { Router, Request, Response } from "express";
import * as db from "@repo/database";

const router = Router();

router

  .get("/", async (req: Request, res: Response) => {
    console.log("DB", db);

    const signers = await db.getSigners();
    res.send({ signers: signers });
  })

  .get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    res.send({ id: id });
  });

export default router;
