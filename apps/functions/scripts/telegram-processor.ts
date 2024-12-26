import { Command } from "commander";
import { processTelegram } from "../src/telegram-processor";

const program = new Command();

program
  .command("run")
  .description("Telegram notification")
  .action(async (blockHeight) => {
    await processTelegram(undefined, undefined);
  });

program.parse();
