import { sendMessageOptions } from "../api";
import { RepliesHandler } from "../repliesHandler";
import * as stacks from "@repo/stacks";
import { fetchPrice } from "../../prices";
import { poxAddressToPool } from "../../constants";
import { currency } from "../../utils";
import { getStacker } from "@repo/database";

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

  async getTokenBalances(wallet: string) {
    const balances = await stacks.getBalances(wallet);

    const stStxInfo =
      balances.fungible_tokens[
        "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token::ststx"
      ];
    const liStxInfo =
      balances.fungible_tokens[
        "SM26NBC8SFHNW4P1Y4DFH27974P56WN86C92HPEHH.token-lqstx::lqstx"
      ];

    return {
      stx: balances.stx.balance / 1000000.0,
      stxLocked: balances.stx.locked / 1000000.0,
      stStx: stStxInfo ? stStxInfo.balance / 1000000.0 : 0.0,
      liStx: liStxInfo ? liStxInfo.balance / 1000000.0 : 0.0,
    };
  }

  async getStackerInfo(wallet: string) {
    const result = await getStacker(wallet);
    if (result.length === 0) {
      return undefined;
    }
    const stackerInfo = result[result.length - 1];

    if (stackerInfo.stackerType === "solo") {
      return {
        type: "solo",
        name: "Unknown",
        logo: "/logos/default.webp",
        amount: stackerInfo.stackedAmount,
      };
    }

    const pool = poxAddressToPool[stackerInfo.poxAddress];
    return {
      type: "pooled",
      name: pool ? pool.name : "Unknown",
      logo: pool ? pool.logo : "/logos/default.webp",
      amount: stackerInfo.stackedAmount,
    };
  }

  async handleMessage(message: any) {
    const wallet = "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG";

    const [
      stxPrice,
      stxPerStStx,
      balances,
      stackerInfo,
      stStxArkadiko,
      stStxBitflow,
      stStxHermetica,
      stStxVelar,
      stStxZest,
    ] = await Promise.all([
      fetchPrice("STX"),
      stacks.getStxPerStStx(),
      this.getTokenBalances(wallet),
      this.getStackerInfo(wallet),
      stacks.getProtocolStStxBalance(wallet, "protocol-arkadiko-v1"),
      stacks.getProtocolStStxBalance(wallet, "protocol-bitflow-v1"),
      stacks.getProtocolStStxBalance(wallet, "protocol-hermetica-v1"),
      stacks.getProtocolStStxBalance(wallet, "protocol-velar-v1"),
      stacks.getProtocolStStxBalance(wallet, "protocol-zest-v1"),
    ]);

    let positions = [
      {
        type: "wallet",
        name: "STX",
        token: "STX",
        balance: balances.stx,
        balance_usd: balances.stx * stxPrice,
      },
      {
        type: "wallet",
        name: "stSTX",
        token: "stSTX",
        balance: balances.stStx,
        balance_usd: balances.stStx * stxPerStStx * stxPrice,
      },
      {
        type: "wallet",
        token: "LiSTX",
        name: "LiSTX",
        balance: balances.liStx,
        balance_usd: balances.liStx * stxPrice,
      },
      {
        type: "direct_stacking",
        name: stackerInfo ? stackerInfo.name : "Direct Stacking",
        token: "STX",
        balance: stackerInfo ? stackerInfo.amount : 0.0,
        balance_usd: stackerInfo ? stackerInfo.amount * stxPrice : 0.0,
      },
      {
        type: "defi",
        name: "Arkadiko stSTX vault",
        token: "stSTX",
        balance: stStxArkadiko,
        balance_usd: stStxArkadiko * stxPerStStx * stxPrice,
      },
      {
        type: "defi",
        name: "BitFlow stSTX/STX LP",
        token: "stSTX",
        balance: stStxBitflow,
        balance_usd: stStxBitflow * stxPerStStx * stxPrice,
      },
      {
        type: "defi",
        name: "Hermetica stSTX vault",
        token: "stSTX",
        balance: stStxHermetica,
        balance_usd: stStxHermetica * stxPerStStx * stxPrice,
      },
      {
        type: "defi",
        name: "Velar stSTX/aeUSDC LP",
        token: "stSTX",
        balance: stStxVelar,
        balance_usd: stStxVelar * stxPerStStx * stxPrice,
      },
      {
        type: "defi",
        name: "Zest stSTX collateral",
        token: "stSTX",
        balance: stStxZest,
        balance_usd: stStxZest * stxPerStStx * stxPrice,
      },
    ];

    let replyMessage = `<b>${wallet}</b>%0A`;

    positions.forEach((position: any) => {
      replyMessage += `<b>${position.name}: </b> `;
      replyMessage += `${currency.rounded.format(position.balance)} ${position.token} = `;
      replyMessage += `$${currency.rounded.format(position.balance)} %0A`;
    });

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

    sendMessageOptions(
      message.message?.chat?.id ?? message.callback_query?.from?.id,
      replyMessage,
      options
    );

    return true;
  }
}
