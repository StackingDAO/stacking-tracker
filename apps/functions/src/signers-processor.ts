import type { Context, ScheduledEvent } from "aws-lambda";
import * as stacksPox from "@repo/stacks/src/pox";
import { getCurrentCycle } from "@repo/stacks/src/pox";
import {
  getLatestCycle,
  saveSigner,
  saveStacker,
} from "@repo/database/src/actions";

export async function processSigners(
  _: ScheduledEvent,
  __: Context
): Promise<void> {
  const [currentCycleNumber, latestCycleNumber] = await Promise.all([
    getCurrentCycle(),
    getLatestCycle(),
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
  }
}
