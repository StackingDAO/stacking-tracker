import { Command } from "commander";
import { processSigners } from "../src/signers-processor";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const program = new Command();

program
  .command("run")
  .description("Save signers and stackers")
  .action(async (blockHeight) => {
    await processSigners(undefined, undefined);
  });

program.parse();
