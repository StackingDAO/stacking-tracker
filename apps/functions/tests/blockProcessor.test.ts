import { getLatestBlock } from "@repo/database/src/actions";
import { processBlock } from "../src/block-processor";

describe("BlockProcessor - Process block", () => {
  test("Save latest block and read from db", async () => {
    const block = {
      Records: [
        {
          body: '{"height":14900}',
        },
      ],
    };
    await processBlock(block, undefined);

    const latestSavedBlock = await getLatestBlock();
    expect(latestSavedBlock).toStrictEqual(14900);
  });
});
