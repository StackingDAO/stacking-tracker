import { Command } from "commander";
import dotenv from "dotenv";
import { processStackerRewards } from "../src/stackers-rewards-processor";
import { SNSEvent } from "aws-lambda";
dotenv.config({ path: "../.env" });

const program = new Command();

program
  .command("run")
  .description("Save stackers rewards")
  .action(async (blockHeight) => {
    await processStackerRewards(
      {
        Records: [
          {
            Sns: {
              Message: JSON.stringify({ block_height: 759774 }),
            },
          },
        ],
      } as SNSEvent,
      undefined
    );
  });

program.parse();
