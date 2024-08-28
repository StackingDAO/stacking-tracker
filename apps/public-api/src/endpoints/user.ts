import { Router, Request, Response } from "express";
import * as stacksAccounts from "@repo/stacks/src/accounts";
import * as contractsStackingDao from "@repo/stacks/src/contracts_stackingdao";

import { fetchPrice } from "../prices";
import { addressToToken, poxAddressToPool } from "../constants";
import { getStacker } from "@repo/database";

async function getTokenBalances(wallet: string) {
  const balances = await stacksAccounts.getBalances(wallet);

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

async function getStxPerStStx() {
  const result = await contractsStackingDao.getStxPerStStx();
  return result.value.value / 1000000.0;
}

async function getStackerInfo(wallet: string) {
  const result = await getStacker(wallet);
  console.log("STACKER", wallet, result);
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
    getStxPerStStx(),
    getTokenBalances(wallet),
    getStackerInfo(wallet),
    contractsStackingDao.getProtocolStStxBalance(
      wallet,
      "protocol-arkadiko-v1"
    ),
    contractsStackingDao.getProtocolStStxBalance(wallet, "protocol-bitflow-v1"),
    contractsStackingDao.getProtocolStStxBalance(
      wallet,
      "protocol-hermetica-v1"
    ),
    contractsStackingDao.getProtocolStStxBalance(wallet, "protocol-velar-v1"),
    contractsStackingDao.getProtocolStStxBalance(wallet, "protocol-zest-v1"),
  ]);

  let positions = [
    {
      type: "wallet",
      name: "STX",
      logo: "/logos/stx.webp",
      balance: balances.stx,
      balance_usd: balances.stx * stxPrice,
    },
    {
      type: "wallet",
      name: "stSTX",
      logo: addressToToken.SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.logo,
      balance: balances.stStx,
      balance_usd: balances.stStx * stxPerStStx * stxPrice,
    },
    {
      type: "wallet",
      name: "LiSTX",
      logo: addressToToken.SM3KNVZS30WM7F89SXKVVFY4SN9RMPZZ9FX929N0V.logo,
      balance: balances.liStx,
      balance_usd: balances.liStx * stxPrice,
    },
    {
      type: "direct_stacking",
      name: stackerInfo ? stackerInfo.name : "Direct Stacking",
      logo: stackerInfo?.logo,
      balance: stackerInfo ? stackerInfo.amount : 0.0,
      balance_usd: stackerInfo ? stackerInfo.amount * stxPrice : 0.0,
    },
    {
      type: "defi",
      name: "Arkadiko stSTX vault",
      logo: addressToToken.SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.logo,
      balance: stStxArkadiko,
      balance_usd: stStxArkadiko * stxPerStStx * stxPrice,
    },
    {
      type: "defi",
      name: "BitFlow stSTX/STX LP",
      logo: addressToToken.SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.logo,
      balance: stStxBitflow,
      balance_usd: stStxBitflow * stxPerStStx * stxPrice,
    },
    {
      type: "defi",
      name: "Hermetica vault",
      logo: addressToToken.SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.logo,
      balance: stStxHermetica,
      balance_usd: stStxHermetica * stxPerStStx * stxPrice,
    },
    {
      type: "defi",
      name: "Velar LP",
      logo: addressToToken.SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.logo,
      balance: stStxVelar,
      balance_usd: stStxVelar * stxPerStStx * stxPrice,
    },
    {
      type: "defi",
      name: "Zest stSTX collateral",
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
