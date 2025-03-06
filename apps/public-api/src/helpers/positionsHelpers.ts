import * as db from "@repo/database";
import * as stacks from "@repo/stacks";
import { fetchCycleStStxBtcSupply, fetchPrice, getPrices } from "../prices";
import { getPoolEntities, getPoolsInfoForCycle } from "../processors/pools";
import { getTokenEntities, getTokensInfoForCycle } from "../processors/tokens";
import { getPositions } from "../processors/positions";
import { getPoxApy, getPoxInfoForCycle } from "../processors/pox";
import { getDefiEntities } from "../processors/defi";
import { delegationAddressToPool } from "../constants";

//
// PoX Positions
//

async function getInfoForCycle(cycleNumber: number) {
  const [stackers, rewards, prices, stStxBtcSupply] = await Promise.all([
    db.getStackersForCycle(cycleNumber),
    db.getRewardsForCycle(cycleNumber),
    getPrices(cycleNumber),
    fetchCycleStStxBtcSupply(cycleNumber),
  ]);

  const soloStackers = stackers.filter(
    (stacker: any) => stacker.stackerType === "solo"
  );
  const soloStackersPoxAddresses = soloStackers.map(
    (stacker: any) => stacker.poxAddress
  );
  const soloStackersRewards = rewards.filter((reward: any) =>
    soloStackersPoxAddresses.includes(reward.rewardRecipient)
  );

  return {
    solo: getPoxInfoForCycle(
      cycleNumber,
      soloStackers,
      soloStackersRewards,
      prices.stx,
      prices.btc
    ),
    pools: getPoolsInfoForCycle(
      cycleNumber,
      stackers,
      rewards,
      prices.stx,
      prices.btc
    ),
    tokens: getTokensInfoForCycle(
      cycleNumber,
      stackers,
      rewards,
      prices.stx,
      prices.btc,
      stStxBtcSupply
    ),
  };
}

async function getDefi(stStxPrice: number) {
  const stStxProtocolVault = [
    "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-vaults-pool-active-v1-1",
    "SPQC38PW542EQJ5M11CR25P7BS1CA6QT4TBXGB3M.stableswap-stx-ststx-v-1-2",
    "SPZA22A4D15RKH5G8XDGQ7BPC20Q5JNMH0VQKSR6.vault-ststx-earn-v1",
    "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.univ2-core",
    "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-vault",
    "SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.amm-vault-v2-01",
  ];

  const results = await Promise.all(
    stStxProtocolVault.map((address: string) => stacks.getBalances(address))
  );

  const stStxBalances = results.map((item: any) =>
    Number(
      item.fungible_tokens[
        "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token::ststx"
      ].balance / 1000000.0
    )
  );

  const stStxBtcBalances = results.map((item: any) =>
    Number(
      item.fungible_tokens[
        "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststxbtc-token::ststxbtc"
      ]?.balance / 1000000.0
    )
  );

  return getDefiEntities(stStxPrice, {
    ststx: {
      arkadiko: stStxBalances[0],
      bitflow: stStxBalances[1],
      hermetica: stStxBalances[2],
      velar: stStxBalances[3],
      zest: stStxBalances[4],
      alex: stStxBalances[5],
    },
    ststxbtc: {
      zest: stStxBtcBalances[4],
    },
  });
}

async function getAllPositions(
  currentCycle: number,
  stxPrice: number,
  btcPrice: number,
  stStxPrice: number
) {
  const promises: any[] = [];
  for (let cycle = currentCycle; cycle > currentCycle - 5; cycle--) {
    promises.push(getInfoForCycle(cycle));
  }
  const results = await Promise.all(promises);

  const resultPools = results.map((item: any) => item.pools);
  const resultTokens = results.map((item: any) => item.tokens);
  const resultSolo = results.map((item: any) => item.solo);

  const poolEntities = getPoolEntities(resultPools, stxPrice, btcPrice);
  const tokenEntities = getTokenEntities(resultTokens, stxPrice, btcPrice);
  const soloApy = getPoxApy(resultSolo.slice(1), stxPrice, btcPrice);

  const defiEntities = await getDefi(stStxPrice);

  const positions = getPositions(poolEntities, tokenEntities, defiEntities, {
    tvl: resultSolo[0].stacked_amount,
    tvl_usd: resultSolo[0].stacked_amount * stxPrice,
    apr: soloApy.apr,
    apy: soloApy.apy,
  });

  return positions;
}

//
// User Positions
//

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
    return {
      id: "solo-stacking",
      name: "Solo Stacking",
      logo: "/logos/stx.webp",
      amount: 0.0,
      delegated_amount: 0.0,
    };
  }

  const lockedAmount = accountInfo.stx.locked / 1000000.0;

  if (stackerInfoRaw && !stackerInfoRaw["delegated-to"]?.value) {
    return {
      id: "solo-stacking",
      name: "Solo Stacking",
      logo: "/logos/stx.webp",
      amount: lockedAmount,
      delegated_amount: 0.0,
    };
  }

  const delegatedAmount = delegationInfoRaw
    ? delegationInfoRaw["amount-ustx"].value / 1000000.0
    : 0.0;

  const delegatedTo = stackerInfoRaw
    ? stackerInfoRaw["delegated-to"].value.value
    : delegationInfoRaw["delegated-to"].value;
  const pool = delegationAddressToPool[delegatedTo];

  return {
    id: pool ? pool.slug : "unknown",
    name: pool ? pool.name : delegatedTo,
    logo: pool ? pool.logo : "/logos/default.webp",
    amount: lockedAmount,
    delegated_amount: delegatedAmount,
  };
}

//
// All Positions
//

function mergeArrays(positions: any[], userInfo: any[]): any[] {
  let mergedArray: any[] = [];
  for (const position of positions) {
    let user = userInfo.filter((item: any) => item.id === position.id)[0];

    if (!user) {
      user = {
        balance: 0.0,
        balance_usd: 0.0,
        symbol: "STX",
      };
    }

    mergedArray.push({ ...position, ...user });
  }

  return mergedArray;
}

export async function getPoxPositions() {
  const [currentCycle, stxPrice, btcPrice, stxPerStStx] = await Promise.all([
    db.getSignersLatestCycle(),
    fetchPrice("STX"),
    fetchPrice("BTC"),
    stacks.getStxPerStStx(),
  ]);
  const stStxPrice = stxPrice * stxPerStStx;

  const positions = await getAllPositions(
    currentCycle,
    stxPrice,
    btcPrice,
    stStxPrice
  );
  return positions;
}

export async function getPoxUserPositions(wallet: string) {
  const [currentCycle, stxPrice, btcPrice, stxPerStStx] = await Promise.all([
    db.getSignersLatestCycle(),
    fetchPrice("STX"),
    fetchPrice("BTC"),
    stacks.getStxPerStStx(),
  ]);
  const stStxPrice = stxPrice * stxPerStStx;

  const [
    // Positions
    positions,
    // Tokens
    balances,
    // Pools + Solo Stacking
    stackerInfo,
    // Defi
    stStxArkadiko,
    stStxBitflow,
    stStxHermetica,
    stStxVelar,
    stStxZest,
  ] = await Promise.all([
    getAllPositions(currentCycle, stxPrice, btcPrice, stStxPrice),
    getTokenBalances(wallet),
    getStackerInfo(wallet),
    stacks.getProtocolStStxBalance(wallet, "protocol-arkadiko-v1"),
    stacks.getProtocolStStxBalance(wallet, "protocol-bitflow-v1"),
    stacks.getProtocolStStxBalance(wallet, "protocol-hermetica-v1"),
    stacks.getProtocolStStxBalance(wallet, "protocol-velar-v1"),
    stacks.getProtocolStStxBalance(wallet, "protocol-zest-v2"),
  ]);

  const userInfo = [
    {
      id: stackerInfo.id,
      balance: Math.max(stackerInfo.amount, stackerInfo.delegated_amount),
      balance_usd:
        Math.max(stackerInfo.amount, stackerInfo.delegated_amount) * stxPrice,
    },
    {
      id: "stackingdao",
      balance: balances.stStx,
      balance_usd: balances.stStx * stStxPrice,
    },
    {
      id: "lisa",
      balance: balances.liStx,
      balance_usd: balances.liStx * stxPrice,
    },
    {
      id: "ststx-arkadiko",
      balance: stStxArkadiko,
      balance_usd: stStxArkadiko * stStxPrice,
      symbol: "stSTX",
    },
    {
      id: "ststx-bitflow",
      balance: stStxBitflow,
      balance_usd: stStxBitflow * stStxPrice,
    },
    {
      id: "ststx-hermetica",
      balance: stStxHermetica,
      balance_usd: stStxHermetica * stStxPrice,
    },
    {
      id: "ststx-velar",
      balance: stStxVelar,
      balance_usd: stStxVelar * stStxPrice,
    },
    {
      id: "ststx-zest",
      balance: stStxZest,
      balance_usd: stStxZest * stStxPrice,
    },
  ];

  const result = mergeArrays(positions, userInfo).sort((a, b) => {
    return b.balance - a.balance;
  });
  return result;
}
