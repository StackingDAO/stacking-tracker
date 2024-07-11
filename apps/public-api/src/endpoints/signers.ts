import { Router, Request, Response } from "express";
import * as db from "@repo/database";

const router = Router();

router

  .get("/", async (req: Request, res: Response) => {
    const signers = await db.getSigners();

    const cycleInfo: { [key: number]: any } = {};
    for (const signer of signers) {
      if (cycleInfo[signer.cycleNumber]) {
        cycleInfo[signer.cycleNumber].signers.push({
          signer_key: signer.signerKey,
          stackers_count: signer.stackersCount,
          stacked_amount: signer.stackedAmount,
        });
        cycleInfo[signer.cycleNumber].stackers += signer.stackersCount;
        cycleInfo[signer.cycleNumber].stackedAmount += signer.stackedAmount;
      } else {
        cycleInfo[signer.cycleNumber] = {
          signers: [
            {
              signer_key: signer.signerKey,
              stackers_count: signer.stackersCount,
              stacked_amount: signer.stackedAmount,
            },
          ],
          stackers: signer.stackersCount,
          stackedAmount: signer.stackedAmount,
        };
      }
    }

    const result = Object.keys(cycleInfo).map((cycle) => {
      return {
        cycle_number: cycle,
        signers: cycleInfo[cycle].signers,
        stackers_count: cycleInfo[cycle].stackersCount,
        stacked_amount: cycleInfo[cycle].stackedAmount,
      };
    });

    res.send(result);
  })

  .get("/:signer", async (req: Request, res: Response) => {
    const { signer } = req.params;

    const [signersInfo, stackersInfo] = await Promise.all([
      db.getSigner(signer),
      db.getStackersForSigner(signer),
    ]);

    const results = [];
    for (const signerInfo of signersInfo) {
      const cycleStackers = stackersInfo.filter(
        (stackerInfo: { cycleNumber: number }) =>
          stackerInfo.cycleNumber === signerInfo.cycleNumber
      );

      results.push({
        cycle_number: signerInfo.cycleNumber,
        signer_key: signerInfo.signerKey,
        stacked_amount: signerInfo.stackedAmount,
        stackers_count: signerInfo.stackersCount,
        stackers: cycleStackers.map((stacker: any) => ({
          address: stacker.stackerAddress,
          stacked_amount: stacker.stackedAmount,
          pox_address: stacker.poxAddress,
          stacker_type: stacker.stackerType,
        })),
      });
    }
    res.send(results);
  });

export default router;
