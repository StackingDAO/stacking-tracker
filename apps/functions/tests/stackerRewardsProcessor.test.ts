import { getStackersRewards } from "@repo/database";
import { processRewards } from "../src/rewards-processor";
import { processSigners } from "../src/signers-processor";
import { processStackerRewards } from "../src/stackers-rewards-processor";

const event: any = {
  Records: [
    {
      Sns: {
        Message: JSON.stringify({ block_height: 15120 }),
      },
    },
  ],
};

describe("processStackerRewards", () => {
  test("should not calculate stacker rewards on all block heights", async () => {
    const event: any = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify({ block_height: 15110 }),
          },
        },
      ],
    };

    await processStackerRewards(event, undefined);

    const stackerRewards = await getStackersRewards();
    expect(stackerRewards.length).toStrictEqual(0);
  });

  test("should not calculate stacker rewards if signer and rewards history not fetched yet", async () => {
    await processStackerRewards(event, undefined);

    const stackerRewards = await getStackersRewards();
    expect(stackerRewards.length).toStrictEqual(0);
  });

  test("should save rewards", async () => {
    await processSigners(undefined, undefined);
    await processRewards(undefined, undefined);

    await processStackerRewards(event, undefined);

    // TODO: check result
    // const stackerRewards = await getStackersRewards();
    // expect(stackerRewards.length).toStrictEqual(0);
  }, 120000);
});
