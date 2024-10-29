import { sendMessageOptions } from "../api";
import { RepliesHandler } from "../repliesHandler";
import * as db from "@repo/database";
import { currency } from "../../utils";
import {
  getPoxPositions,
  getPoxUserPositions,
} from "../../helpers/positionsHelpers";

export class CommandPositions extends RepliesHandler {
  canHandleMessage(message: any) {
    const messageText = message.message?.text;
    if (messageText && messageText === "/positions") {
      return true;
    }

    const callbackText = message.callback_query?.data;
    if (callbackText && JSON.parse(callbackText).command === "/positions") {
      return true;
    }

    return false;
  }

  async sendNoWallet(message: any) {
    const replyMessage = `%0A<b>No wallet added yet..</b> `;

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
    const telegramChat = await db.getChat(
      message.message?.chat?.id ?? message.callback_query?.from?.id
    );
    const wallet = telegramChat?.addresses;

    const positions = wallet
      ? await getPoxUserPositions(wallet)
      : await getPoxPositions();

    let replyMessage = wallet
      ? `<b>${wallet}</b>%0A%0A`
      : `<b>Add your wallet to view your balances.</b>%0A%0A`;

    var totalBalanceUsd = 0.0;
    positions.forEach((position: any) => {
      replyMessage += `<a href='${position.link}'><b>${position.name} - APY: ${currency.short.format(position.apy)}% </b></a>%0A`;

      if (position.balance > 0) {
        replyMessage += `<b>Balance: ${currency.rounded.format(position.balance)} ${position.symbol} = `;
        replyMessage += `$${currency.rounded.format(position.balance_usd)}</b>%0A`;
        totalBalanceUsd += position.balance_usd;
      }

      replyMessage += `TVL: ${currency.rounded.format(position.tvl)} ${position.symbol} = `;
      replyMessage += `$${currency.rounded.format(position.tvl_usd)}%0A%0A`;
    });

    replyMessage += `%0A<b>Your total balance: $${currency.rounded.format(totalBalanceUsd)}</b> `;

    const options = [
      [
        {
          text: "← Back",
          callback_data: JSON.stringify({ command: "/start" }),
        },
        {
          text: "↻ Refresh",
          callback_data: JSON.stringify({ command: "/positions" }),
        },
      ],
    ];

    if (!wallet) {
      options.push([
        {
          text: "Add Wallet →",
          callback_data: JSON.stringify({ action: "update-wallet" }),
        },
      ]);
    }

    sendMessageOptions(
      message.message?.chat?.id ?? message.callback_query?.from?.id,
      replyMessage,
      options
    );

    return true;
  }
}
