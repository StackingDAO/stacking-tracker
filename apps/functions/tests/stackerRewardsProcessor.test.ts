import { getRewards } from "@repo/database/src/actions";
import { processStackerRewards } from "../src/stacker-rewards-processor";

describe("processStackerRewards", () => {
  test("should save rewards", async () => {
    await processStackerRewards(undefined, undefined);

    // TODO: check result
    // let rewards = await getRewards();
    // expect(rewards.length).toStrictEqual(9750);

    // await processRewards(undefined, undefined);

    // rewards = await getRewards();
    // expect(rewards.length).toBeGreaterThan(13000);
  }, 120000);
});
