import { Command } from "commander";
import dotenv from "dotenv";
import { processCyclePrices } from "../src/prices-processor";
dotenv.config({ path: "../.env" });

const program = new Command();

program
  .command("run")
  .description("Save cycle prices")
  .action(async (blockHeight) => {
    await processCyclePrices(undefined, undefined);
  });

program.parse();
