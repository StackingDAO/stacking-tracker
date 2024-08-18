import { getMiners } from "@repo/database";
import { processMiners } from "../src/miners-processor";

const event: any = {
  Records: [
    {
      Sns: {
        Message: JSON.stringify({ block_height: 158949 }),
      },
    },
  ],
};

describe("processMiners", () => {
  test("should process miners", async () => {
    await processMiners(event, undefined);

    let miners = await getMiners(158949 - 100, 158949 - 50);
    expect(miners.length).toStrictEqual(0);

    miners = await getMiners(158949 + 1, 158949 + 10);
    expect(miners.length).toStrictEqual(0);

    miners = await getMiners(158949 - 100, 158949);
    expect(miners.length).toStrictEqual(23);

    await processMiners(event, undefined);

    miners = await getMiners(158949 - 100, 158949);
    expect(miners.length).toBeGreaterThan(23 + 1);
  }, 120000);
});
