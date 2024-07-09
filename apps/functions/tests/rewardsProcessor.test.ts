import { getRewards } from "@repo/database/src/actions";
import { processRewards } from "../src/rewards-processor";

describe("processRewards", () => {
  test("should save rewards", async () => {
    await processRewards(undefined, undefined);

    const rewards = await getRewards();
    expect(rewards.length).toStrictEqual(250);
  }, 60000);
});
