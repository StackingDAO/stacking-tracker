import { Router, Request, Response } from "express";
import * as stacks from "@repo/stacks";
import { fetchPrice } from "../prices";
import { addressToToken, delegationAddressToPool } from "../constants";

async function getTokenBalances(wallet: string) {
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

async function getStackerInfo(wallet: string) {
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
      logo: "/logos/default.webp",
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
    logo: pool ? pool.logo : "/logos/default.webp",
    amount: lockedAmount,
    delegated_amount: delegatedAmount,
  };
}

const router = Router();

router.get("/:wallet", async (req: Request, res: Response) => {
  const { wallet } = req.params;

  const [
    stxPrice,
    btcPrice,
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
    fetchPrice("BTC"),
    stacks.getStxPerStStx(),
    getTokenBalances(wallet),
    getStackerInfo(wallet),
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
      logo: "/logos/stx.webp",
      balance: balances.stx,
      balance_usd: balances.stx * stxPrice,
    },
    {
      type: "wallet",
      name: "stSTX",
      symbol: "stSTX",
      logo: addressToToken.SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.logo,
      balance: balances.stStx,
      balance_usd: balances.stStx * stxPerStStx * stxPrice,
    },
    {
      type: "wallet",
      name: "LiSTX",
      symbol: "LiSTX",
      logo: addressToToken.SM3KNVZS30WM7F89SXKVVFY4SN9RMPZZ9FX929N0V.logo,
      balance: balances.liStx,
      balance_usd: balances.liStx * stxPrice,
    },
    {
      type: "direct_stacking",
      name: stackerInfo ? stackerInfo.name : "Direct Stacking",
      symbol: "STX",
      logo: stackerInfo?.logo,
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
      logo: addressToToken.SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.logo,
      balance: stStxArkadiko,
      balance_usd: stStxArkadiko * stxPerStStx * stxPrice,
    },
    {
      type: "defi",
      name: "BitFlow stSTX/STX LP",
      symbol: "stSTX",
      logo: addressToToken.SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.logo,
      balance: stStxBitflow,
      balance_usd: stStxBitflow * stxPerStStx * stxPrice,
    },
    {
      type: "defi",
      name: "Hermetica stSTX vault",
      symbol: "stSTX",
      logo: addressToToken.SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.logo,
      balance: stStxHermetica,
      balance_usd: stStxHermetica * stxPerStStx * stxPrice,
    },
    {
      type: "defi",
      name: "Velar stSTX/aeUSDC LP",
      symbol: "stSTX",
      logo: addressToToken.SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.logo,
      balance: stStxVelar,
      balance_usd: stStxVelar * stxPerStStx * stxPrice,
    },
    {
      type: "defi",
      name: "Zest stSTX collateral",
      symbol: "stSTX",
      logo: addressToToken.SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.logo,
      balance: stStxZest,
      balance_usd: stStxZest * stxPerStStx * stxPrice,
    },
  ];

  res.send({
    prices: {
      stx: stxPrice,
      btc: btcPrice,
    },
    positions: positions,
  });
});

export default router;
