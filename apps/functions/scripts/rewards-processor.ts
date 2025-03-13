import { Command } from "commander";
import dotenv from "dotenv";
import { processRewards } from "../src/rewards-processor";
dotenv.config({ path: "../.env" });

const program = new Command();

program
  .command("run")
  .description("Save rewards")
  .action(async (blockHeight) => {
    await processRewards(undefined, undefined);
  });

program.parse();
