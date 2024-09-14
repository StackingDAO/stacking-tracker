import { Router, Request, Response } from "express";
import { handleMessage } from "../telegram/replies";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  await handleMessage(req.body);
  res.send({});
});

export default router;
