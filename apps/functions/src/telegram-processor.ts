import type { Context, ScheduledEvent } from "aws-lambda";
import { processCycleEnding } from "./telegram/cycle-end";
import { processStackingDaoRewards } from "./telegram/stackingdao-rewards";

export async function processTelegram(
  _: ScheduledEvent,
  __: Context
): Promise<void> {
  await processCycleEnding();
  await processStackingDaoRewards();
}
