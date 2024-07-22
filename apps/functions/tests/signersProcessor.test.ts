import {
  getSignersLatestCycle,
  getSigners,
  getStackers,
} from "@repo/database/src/actions";
import { processSigners } from "../src/signers-processor";

describe("processSigners", () => {
  test("should save signers and stackers", async () => {
    let latestCycle = await getSignersLatestCycle();
    expect(latestCycle).toStrictEqual(0);

    await processSigners(undefined, undefined);

    const signers = await getSigners();
    expect(signers.length).toStrictEqual(27);

    const stackers = await getStackers();
    expect(stackers.length).toStrictEqual(366);

    latestCycle = await getSignersLatestCycle();
    expect(latestCycle).toStrictEqual(84);
  }, 10000);
});
