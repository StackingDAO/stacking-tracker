import { sendMessageOptions } from "../api";
import { RepliesHandler } from "../repliesHandler";
import * as stacks from "@repo/stacks";
import { fetchPrice } from "../../prices";
import { delegationAddressToPool } from "../../constants";
import { currency } from "../../utils";

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
    const [stackerInfoRaw, delegationInfoRaw, accountInfo] = await Promise.all([
      stacks.getStackerInfo(wallet),
      stacks.getDelegationInfo(wallet),
      stacks.getBalances(wallet),
    ]);

    if (!stackerInfoRaw && !delegationInfoRaw) {
      return undefined;
    }

    const lockedAmount = accountInfo.stx.locked / 1000000.0;

    if (!stackerInfoRaw["delegated-to"]?.value) {
      return {
        name: "Solo Stacking",
        amount: lockedAmount,
      };
    }

    const delegatedAmount = delegationInfoRaw
      ? delegationInfoRaw["amount-ustx"].value / 1000000.0
      : 0.0;

    const delegatedTo = stackerInfoRaw
      ? stackerInfoRaw["delegated-to"].value.value
      : delegationInfoRaw["delegated-to"].value.value;
    const pool = delegationAddressToPool[delegatedTo];

    return {
      name: pool ? pool.name : delegatedTo,
      amount: lockedAmount,
      delegated_amount: delegatedAmount,
    };
  }
  async handleMessage(message: any) {
    const wallet = "SP2TGEEMSCRX62W4PNCHM849QY1YGT3Z6M12QCPA0";

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
        symbol: "STX",
        balance: balances.stx,
        balance_usd: balances.stx * stxPrice,
      },
      {
        type: "wallet",
        name: "stSTX",
        symbol: "stSTX",
        balance: balances.stStx,
        balance_usd: balances.stStx * stxPerStStx * stxPrice,
      },
      {
        type: "wallet",
        name: "LiSTX",
        symbol: "LiSTX",
        balance: balances.liStx,
        balance_usd: balances.liStx * stxPrice,
      },
      {
        type: "direct_stacking",
        name: stackerInfo ? stackerInfo.name : "Direct Stacking",
        symbol: "STX",
        balance: stackerInfo ? stackerInfo.amount : 0.0,
        balance_usd: stackerInfo ? stackerInfo.amount * stxPrice : 0.0,
        delegated: stackerInfo ? stackerInfo.delegated_amount : 0.0,
        delegated_usd: stackerInfo
          ? stackerInfo.delegated_amount * stxPrice
          : 0.0,
      },
      {
        type: "defi",
        name: "Arkadiko stSTX vault",
        symbol: "stSTX",
        balance: stStxArkadiko,
        balance_usd: stStxArkadiko * stxPerStStx * stxPrice,
      },
      {
        type: "defi",
        name: "BitFlow stSTX/STX LP",
        symbol: "stSTX",
        balance: stStxBitflow,
        balance_usd: stStxBitflow * stxPerStStx * stxPrice,
      },
      {
        type: "defi",
        name: "Hermetica stSTX vault",
        symbol: "stSTX",
        balance: stStxHermetica,
        balance_usd: stStxHermetica * stxPerStStx * stxPrice,
      },
      {
        type: "defi",
        name: "Velar stSTX/aeUSDC LP",
        symbol: "stSTX",
        balance: stStxVelar,
        balance_usd: stStxVelar * stxPerStStx * stxPrice,
      },
      {
        type: "defi",
        name: "Zest stSTX collateral",
        symbol: "stSTX",
        balance: stStxZest,
        balance_usd: stStxZest * stxPerStStx * stxPrice,
      },
    ];

    const filteredPositions = positions.filter(
      (position: any) => position.balance > 0
    );

    let replyMessage = `<b>${wallet}</b>%0A%0A`;

    var totalBalanceUsd = 0.0;
    filteredPositions.forEach((position: any) => {
      replyMessage += `<b>${position.name}: </b> `;
      replyMessage += `${currency.rounded.format(position.balance)} ${position.symbol} = `;
      replyMessage += `$${currency.rounded.format(position.balance_usd)}`;

      if (position.delegated) {
        replyMessage += ` (Delegated: ${currency.rounded.format(position.delegated)} ${position.symbol} = `;
        replyMessage += `$${currency.rounded.format(position.delegated_usd)})`;
      }

      replyMessage += `%0A`;
      totalBalanceUsd += position.balance_usd;
    });

    replyMessage += `%0A<b>Total balance: $${currency.rounded.format(totalBalanceUsd)}</b> `;

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
