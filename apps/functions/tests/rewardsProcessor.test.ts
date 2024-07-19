import { getRewards } from "@repo/database/src/actions";
import { processRewards } from "../src/rewards-processor";

describe("processRewards", () => {
  test("should save rewards", async () => {
    await processRewards(undefined, undefined);

    let rewards = await getRewards();
    expect(rewards.length).toStrictEqual(9750);

    await processRewards(undefined, undefined);

    rewards = await getRewards();
    expect(rewards.length).toBeGreaterThan(13000);
  }, 120000);
});
