import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { sendMessage } from "@repo/telegram";
import * as stacks from "@repo/stacks";
import * as db from "@repo/database";

export async function processStackingDaoRewards(): Promise<void> {
  const transactions = await stacks.getAddressTransactions(
    "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.rewards-v3"
  );

  const processRewardsTxs = transactions.results.filter(
    (tx: any) =>
      tx.tx.tx_status === "success" &&
      tx.tx.tx_type === "contract_call" &&
      tx.tx.contract_call.function_name === "process-rewards"
  );

  const lastProcessRewards = await stacks.getTransactionById(
    processRewardsTxs[0].tx.tx_id
  );

  const burnBlockHeight = lastProcessRewards.burn_block_height;

  let addedStx = 0.0;
  let addedBtc = 0.0;
  for (const event of lastProcessRewards.events) {
    if (event.event_type === "smart_contract_log") {
      const eventInfo = stacks.reprHexToJson(event.contract_log.value.hex);

      if (eventInfo.value.action.value === "process-rewards-ststx") {
        addedStx += parseFloat(eventInfo.value.data.value.rewards.value);
      } else if (eventInfo.value.action.value === "process-rewards-ststxbtc") {
        addedBtc += parseFloat(eventInfo.value.data.value.rewards.value);
      }
    }
  }

  const telegramChats =
    await db.getChatsBlockStackingDaoRewards(burnBlockHeight);
  console.log("[Telegram StackingDAO Rewards] - Chats", telegramChats.length);

  const replyMessage = `<b>StackingDAO</b> just added <b>${addedStx / 1000000.0} STX</b> and <b>${addedBtc / 100000000.0} sBTC</b> as rewards!`;

  for (const chat of telegramChats) {
    const [messageResult] = await Promise.all([
      sendMessage(BigInt(chat.chatId), replyMessage),
      db.saveChat(chat.chatId, undefined, undefined, burnBlockHeight),
    ]);

    console.log(
      "[Telegram StackingDAO Rewards] - Message results",
      messageResult
    );
  }
}
