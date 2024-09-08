import { sendMessage, sendMessageReply } from "../api";
import { RepliesHandler } from "../repliesHandler";
import NodeCache from "node-cache";

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

    // TODO: check input
    // TODO: save address to DB

    const replyMessage = `<b>The address has been saved: ${message.message.text}</b>%0A`;
    await sendMessage(userId, replyMessage);
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
