import { getMiners } from "@repo/database";
import { processMiners } from "../src/miners-processor";

const events: any = [
  {
    Records: [
      {
        Sns: {
          Message: JSON.stringify({ block_height: 150992 }),
        },
      },
    ],
  },
  {
    Records: [
      {
        Sns: {
          Message: JSON.stringify({ block_height: 150993 }),
        },
      },
    ],
  },
  {
    Records: [
      {
        Sns: {
          Message: JSON.stringify({ block_height: 150994 }),
        },
      },
    ],
  },
];

describe("processMiners", () => {
  test("should process miners", async () => {
    await processMiners(events[0], undefined);
    await processMiners(events[1], undefined);
    await processMiners(events[2], undefined);

    let miners = await getMiners(150990, 150994);
    console.log("GOT MINERS", miners);
  }, 120000);
});
