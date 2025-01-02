import { isValidStacksAddress } from "@repo/stacks";
import { RepliesHandler } from "../repliesHandler";
import * as db from "@repo/database";
import NodeCache from "node-cache";
import { sendMessageOptions, sendMessageReply } from "@repo/telegram";

const replyRequestCache = new NodeCache({ stdTTL: 600 });

export class ActionUpdateWallet extends RepliesHandler {
  canHandleMessage(message: any) {
    const userId =
      message.message?.chat?.id ?? message.callback_query?.from?.id;
    const messageId =
      message.message?.message_id ?? message.callback_query?.message?.id;

    const lastMessage = replyRequestCache.get(userId) as any | undefined;

    if (lastMessage && lastMessage.result.message_id + 1 === messageId) {
      return true;
    }

    const callbackText = message.callback_query?.data;
    if (callbackText && JSON.parse(callbackText).action === "update-wallet") {
      return true;
    }

    return false;
  }

  async handleMessageStart(message: any) {
    const userId =
      message.message?.chat?.id ?? message.callback_query?.from?.id;

    replyRequestCache.set(userId, message);

    const replyMessage = `<b>Enter the wallet you want to monitor</b>%0A`;

    const result = await sendMessageReply(userId, replyMessage);
    replyRequestCache.set(userId, result);
  }

  async handleMessageValue(message: any) {
    const userId =
      message.message?.chat?.id ?? message.callback_query?.from?.id;

    if (!isValidStacksAddress(message.message.text)) {
      const options = [
        [
          {
            text: "← Back",
            callback_data: JSON.stringify({ command: "/start" }),
          },
        ],
        [
          {
            text: "Update Wallet →",
            callback_data: JSON.stringify({ action: "update-wallet" }),
          },
        ],
      ];

      const replyMessage = `The address you entered is invalid.%0A`;
      await sendMessageOptions(userId, replyMessage, options);

      return;
    }

    await db.saveChat(userId, message.message.text);

    const options = [
      [
        {
          text: "← Back",
          callback_data: JSON.stringify({ command: "/start" }),
        },
      ],
      [
        {
          text: "Stacking Positions →",
          callback_data: JSON.stringify({ command: "/positions" }),
        },
      ],
    ];

    const replyMessage = `The address has been saved!%0A<b>${message.message.text}</b>%0A`;
    await sendMessageOptions(userId, replyMessage, options);
  }

  async handleMessage(message: any) {
    if (!message.message?.reply_to_message) {
      await this.handleMessageStart(message);
    } else {
      await this.handleMessageValue(message);
    }

    return true;
  }
}
