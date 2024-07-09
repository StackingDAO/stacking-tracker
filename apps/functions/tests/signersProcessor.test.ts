import { getLatestCycle } from "@repo/database/src/actions";
import processSigners from "../src/signers-processor";

describe("ApiSignersProcessor - ...", () => {
  test(".....", async () => {
    await processSigners(undefined, undefined);

    const latestCycle = await getLatestCycle();
    expect(latestCycle).toStrictEqual(84);
  }, 10000);
});
