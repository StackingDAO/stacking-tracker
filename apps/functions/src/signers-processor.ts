import type { Context, ScheduledEvent } from "aws-lambda";
import * as stacksPox from "@repo/stacks/src/pox";
import { getCurrentCycle } from "@repo/stacks/src/pox";
import {
  getSignersLatestCycle,
  saveSigner,
  saveStacker,
} from "@repo/database/src/actions";

export async function processSigners(
  _: ScheduledEvent,
  __: Context
): Promise<void> {
  const [currentCycleNumber, latestCycleNumber] = await Promise.all([
    getCurrentCycle(),
    getSignersLatestCycle(),
  ]);
  const cycleNumber = Math.max(latestCycleNumber, 83) + 1;

  console.log(
    "Current cycle:",
    currentCycleNumber,
    ", Latest cycle:",
    latestCycleNumber,
    ", Cycle to handle:",
    cycleNumber
  );

  if (currentCycleNumber <= latestCycleNumber) {
    return;
  }

  const signers = await stacksPox.getCycleSigners(cycleNumber);

  for (const signer of signers) {
    await saveSigner(
      cycleNumber,
      signer.signing_key,
      signer.solo_stacker_count + signer.pooled_stacker_count,
      signer.stacked_amount / 1000000.0
    );

    // Bug in API?
    // Error 500 for signer 0x02877ce29ba35458b827a6ea18510b9058ae4c30e2c33d288f2982c13497caec6e in cycle 94
    try {
      const stackers = await stacksPox.getSignerStackers(
        cycleNumber,
        signer.signing_key
      );

      for (const stacker of stackers) {
        await saveStacker(
          cycleNumber,
          signer.signing_key,
          stacker.stacker_address,
          stacker.stacked_amount / 1000000.0,
          stacker.pox_address,
          stacker.stacker_type
        );
      }
    } catch (error) {}
  }
}
