import { sendMessageOptions } from "../api";
import { RepliesHandler } from "../repliesHandler";

export class CommandWallet extends RepliesHandler {
  canHandleMessage(message: any) {
    const messageText = message.message?.text;
    if (messageText && messageText === "/wallet") {
      return true;
    }

    const callbackText = message.callback_query?.data;
    if (callbackText && JSON.parse(callbackText).command === "/wallet") {
      return true;
    }

    return false;
  }

  async handleMessageWallet(message: any) {
    const replyMessage = `<b>Saved Wallet</b>%0A` + `SP.... %0A`;

    const options = [
      [
        {
          text: "← Back",
          callback_data: JSON.stringify({ command: "/start" }),
        },
        {
          text: "↻ Refresh",
          callback_data: JSON.stringify({ command: "/wallet" }),
        },
      ],
      [
        {
          text: "Update Wallet →",
          callback_data: JSON.stringify({ action: "update-wallet" }),
        },
      ],
    ];

    sendMessageOptions(
      message.message?.chat?.id ?? message.callback_query?.from?.id,
      replyMessage,
      options
    );
  }

  async handleMessageNoWallet(message: any) {
    const replyMessage =
      `<b>Add Wallet</b>%0A` + `Add a wallet to monitor the balances. %0A`;

    const options = [
      [
        {
          text: "← Back",
          callback_data: JSON.stringify({ command: "/start" }),
        },
      ],
      [
        {
          text: "Add Wallet →",
          callback_data: JSON.stringify({ action: "update-wallet" }),
        },
      ],
    ];

    sendMessageOptions(
      message.message?.chat?.id ?? message.callback_query?.from?.id,
      replyMessage,
      options
    );
  }

  async handleMessage(message: any) {
    // TODO: get wallet info from DB
    const hasWallet = false;

    if (hasWallet) {
      await this.handleMessageWallet(message);
    } else {
      await this.handleMessageNoWallet(message);
    }

    return true;
  }
}
