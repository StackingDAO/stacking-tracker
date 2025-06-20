export const tokensList = [
  {
    address: "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG",
    entity: "StackingDAO",
    name: "stSTX",
    slug: "stackingdao",
    logo: "/logos/stackingdao.webp",
    logo_token: "/logos/ststx.webp",
    website: "https://www.stackingdao.com",
    tokenAddresses: ["SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststx-token"],
  },
  {
    address: "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG",
    entity: "StackingDAO",
    name: "stSTXbtc",
    slug: "stackingdao-btc",
    logo: "/logos/stackingdao.webp",
    logo_token: "/logos/ststxbtc.webp",
    website: "https://www.stackingdao.com",
    tokenAddresses: [
      "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststxbtc-token",
      "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.ststxbtc-token-v2",
    ],
  },
  {
    address: "SM3KNVZS30WM7F89SXKVVFY4SN9RMPZZ9FX929N0V",
    entity: "Lisa",
    name: "LiSTX",
    slug: "lisa",
    logo: "/logos/lisa.webp",
    logo_token: "/logos/listx.webp",
    website: "https://app.lisalab.io",
    tokenAddresses: ["SM26NBC8SFHNW4P1Y4DFH27974P56WN86C92HPEHH.token-lqstx"],
  },
];

export const poxAddressToPool = {
  bc1qeagslq8gm4ylmgxf9ngx24mnwffsqnprrsjc0n: {
    name: "StackingDAO Pool",
    slug: "stackingdao-pool",
    logo: "/logos/stackingdao.webp",
    website: "https://app.stackingdao.com/?stackingOption=stx",
    symbol: "BTC",
    fee: 0.0,
    feeDisclosed: true,
  },
  bc1qmv2pxw5ahvwsu94kq5f520jgkmljs3af8ly6tr: {
    name: "Xverse Pool",
    slug: "xverse-pool",
    logo: "/logos/xverse.webp",
    website: "https://xverse-pool.com",
    symbol: "BTC",
    fee: 0.05,
    feeDisclosed: true,
  },
  bc1qs0kkdpsrzh3ngqgth7mkavlwlzr7lms2zv3wxe: {
    name: "Fast Pool",
    slug: "fast-pool",
    logo: "/logos/fastpool.webp",
    website: "https://fastpool.org",
    symbol: "STX",
    fee: 0.05,
    feeDisclosed: true,
  },
  bc1q7w0jpwwjyq48qhyecnuwazfqv56880q67pmtfc: {
    name: "Fast Pool v2",
    slug: "fast-pool-v2",
    logo: "/logos/fastpool.webp",
    website: "https://fastpool.org",
    symbol: "STX",
    fee: 0.05,
    feeDisclosed: true,
  },
  bc1qs33quxgnwkrspgu82lmaczw7gtcfa88pll8fqm: {
    name: "Planbetter Pool",
    slug: "planbetter-pool",
    logo: "/logos/planbetter.webp",
    website: "https://www.planbetter.org",
    symbol: "BTC",
    fee: 0.05,
    feeDisclosed: true,
  },
  "15uuC9CPwSuV3inJcuU5Uon111yosYbzAb": {
    name: "Blockdaemon",
    slug: "blockdaemon",
    logo: "/logos/blockdaemon.webp",
    website: "https://www.blockdaemon.com/stacks",
    symbol: "BTC",
    fee: 0.0,
    feeDisclosed: false,
  },
  bc1qcc2pumtnrtcj4mk9w0y37xynhqarh40zsy5v77: {
    name: "Luganodes",
    slug: "luganodes",
    logo: "/logos/luganodes.webp",
    website: "https://www.luganodes.com/blog/StacksSG",
    symbol: "BTC",
    fee: 0.0,
    feeDisclosed: false,
  },
  bc1qsfahfanetg4v75x6qj82mvs033le6sfflghpws: {
    name: "Senseinode",
    slug: "senseinode",
    logo: "/logos/default.webp",
    website: "https://www.senseinode.com/en-stake/stacks",
    symbol: "BTC",
    fee: 0.0,
    feeDisclosed: false,
  },
};

export const delegationAddressToPool = {
  SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG: {
    name: "StackingDAO Pool",
    slug: "stackingdao-pool",
    logo: "/logos/stackingdao.webp",
    website: "https://app.stackingdao.com/?stackingOption=stx",
  },
  SPXVRSEH2BKSXAEJ00F1BY562P45D5ERPSKR4Q33: {
    name: "Xverse Pool",
    slug: "xverse-pool",
    logo: "/logos/xverse.webp",
    website: "https://xverse-pool.com",
  },
  "SP21YTSM60CAY6D011EZVEVNKXVW8FVZE198XEFFP.pox4-fast-pool-v3": {
    name: "Fast Pool",
    slug: "fast-pool",
    logo: "/logos/fastpool.webp",
    website: "https://fastpool.org",
  },
  "SPMPMA1V6P430M8C91QS1G9XJ95S59JS1TZFZ4Q4.pox4-multi-pool-v1": {
    name: "Fast Pool v2",
    slug: "fast-pool-v2",
    logo: "/logos/fastpool.webp",
    website: "https://fastpool.org",
  },
};

export const signerKeyToPool = {
  "0x025588e24e2bf387fe8cc7bccba1aac7fe599b96724892431e992a40d06e8fe220": {
    name: "StackingDAO",
    slug: "stackingdao",
    logo: "/logos/stackingdao.webp",
    website: "https://www.stackingdao.com",
  },
  "0x03a541c1ec2cfb32da48cfadf439c9b2f27d166bbffa18a178c7a6a0d54cfa7813": {
    name: "Blockdaemon",
    slug: "blockdaemon",
    logo: "/logos/blockdaemon.webp",
    website: "https://www.blockdaemon.com/stacks",
  },
  "0x029e1245f007bd8f76d5ce67e759acd21f8b0f2538a80713468f7524bf3fff6136": {
    name: "Luganodes",
    slug: "luganodes",
    logo: "/logos/luganodes.webp",
    website: "https://www.luganodes.com/blog/StacksSG",
  },
  "0x03e0df37e83e43847625a0320456cb9758050a61ce76c2c130bf50242f27ba6d54": {
    name: "Alum Labs",
    slug: "alum-labs",
    logo: "/logos/alum-labs.webp",
    website: "https://alumlabs.io",
  },
  "0x0215245613e31de2ec2e7f2c4facb45724be2e49d9d42abb0a5e571322593b36bf": {
    name: "Kiln #1",
    slug: "kiln-1",
    logo: "/logos/kiln.webp",
    website: "https://www.kiln.fi",
  },
  "0x0244869db071d334ff8e5cd94956ae7b60a4abd41f83f3c9d66ab314718151d94d": {
    name: "Restake",
    slug: "restake",
    logo: "/logos/restake.webp",
    website: "https://www.restake.net/protocols/stacks",
  },
  "0x034df3feda207a1cd4f31ae2b58f136a0d382d23419ef8d06569fa538202ba8aed": {
    name: "Chorus One #1",
    slug: "chorus-one-1",
    logo: "/logos/chorusone.webp",
    website: "https://chorus.one/crypto-staking-networks/stacks",
  },
  "0x02254a34747123978819f2a90506f76cb057fe3fbff6d8721a0d9cf8e9412d0e60": {
    name: "Chorus One #2",
    slug: "chorus-one-2",
    logo: "/logos/chorusone.webp",
    website: "https://chorus.one/crypto-staking-networks/stacks",
  },
  "0x03cc1da6f6235699284987f7d3a98a950b0c693cdbed87ab33c04f61e2dfb6a177": {
    name: "DeSpread",
    slug: "despread",
    logo: "/logos/despread.webp",
    website: "https://despread.io",
  },
  "0x0309126df3691918f25f8872819bc8268e9e1e0d92d0494fa4fb9783589a1392fa": {
    name: "Foundry",
    slug: "foundry",
    logo: "/logos/foundry.webp",
    website: "https://foundrydigital.com",
  },
  "0x027af6b78b484b2c129dab7e490e8438f9a6eb4890071335a5781d483073866b9a": {
    name: "Hashkey",
    slug: "hashkey",
    logo: "/logos/hashkey.webp",
    website: "https://www.hashkey.com",
  },
  "0x02c54d8b1ba4b7207f78f861c60f8a67433c264a11ac9b6b7773476e9f6c008e49": {
    name: "Infstones",
    slug: "infstones",
    logo: "/logos/infstones.webp",
    website: "https://infstones.com",
  },

  "0x0302328212d5e430a8a880f8e2365a8f976ee50490ff030c106866c0b789eae91a": {
    name: "Xverse #2",
    slug: "xverse-2",
    logo: "/logos/xverse.webp",
    website: "https://xverse-pool.com",
  },
  "0x02877ce29ba35458b827a6ea18510b9058ae4c30e2c33d288f2982c13497caec6e": {
    name: "Xverse #1",
    slug: "xverse-1",
    logo: "/logos/xverse.webp",
    website: "https://xverse-pool.com",
  },
  "0x03b3b78738abbdc573cdcefd8200b1bca999e2f2fd8ecdf70c64ced1e4105437b7": {
    name: "Xverse #3",
    slug: "xverse-3",
    logo: "/logos/xverse.webp",
    website: "https://xverse-pool.com",
  },

  "0x023d6ecdc36fa1e1c6a9f116c7f13ae843001ed9d617f66f6c68cabf751bf82555": {
    name: "Fast Pool",
    slug: "fast-pool",
    logo: "/logos/fastpool.webp",
    website: "https://fastpool.org",
  },
  "0x023d6e4adbd5e7bedd5a1e1b85940e1e8c6c34924fd0d584e5e15d84c8572083d9": {
    name: "Fast Pool v2",
    slug: "fast-pool-v2",
    logo: "/logos/fastpool.webp",
    website: "https://fastpool.org",
  },
  "0x03ed732eab6b99b90315f9b58ce9c3e2d1991bc4e9cfa59841535c0ef7dbba38e0": {
    name: "Planbetter",
    slug: "planbetter",
    logo: "/logos/planbetter.webp",
    website: "https://www.planbetter.org",
  },
  "0x0284df4505c6318a0017a7848aa0a95bf8cd3db697a89d2ec1978a027bece770ef": {
    name: "Degen Lab",
    slug: "degen-lab",
    logo: "/logos/degenlab.webp",
    website: "https://degenlab.io",
  },
  "0x02b20a0603a409270d4421d89a831e8f7b2fa7c5f2d8872d7aa94737334d10c194": {
    name: "Luxor",
    slug: "luxor",
    logo: "/logos/default.webp",
    website: "https://luxor.tech",
  },
  "0x03cef32afac202346ac76a28e81e77ed497c3f22ce20ac54b496950b4ef0b74b2e": {
    name: "Staking Defense League",
    slug: "staking-defense-league",
    logo: "/logos/default.webp",
    website: "https://stakingdefenseleague.com",
  },
  "0x039dc5297b92c1f6b48f4a68e180b853ff6e8188fb78422652a90b8fe14941adce": {
    name: "Kiln #2",
    slug: "kiln-2",
    logo: "/logos/kiln.webp",
    website: "https://www.kiln.fi/protocols/stacks",
  },
  "0x024f164c6e73df283d34d7d9cc86553a82dce76045ba7dfbf4de0004f89eabb8e0": {
    name: "Senseinode",
    slug: "senseinode",
    logo: "/logos/default.webp",
    website: "https://www.senseinode.com/en-stake/stacks",
  },
  "0x025f9fd3d308e7306e154d9a5466a5aee6918258cdb08924ade59bea04f472b339": {
    name: "Figment",
    slug: "figment",
    logo: "/logos/default.webp",
    website: "https://figment.io/staking-stacks",
  },
  "0x02844807121921880119fe05ae47fccb4945a4bb2f840fe7de66e6f32640bc8169": {
    name: "L2-Labs #1",
    slug: "l2-labs-1",
    logo: "/logos/l2-labs.webp",
    website: "https://bitcoinl2labs.com/",
  },
  "0x0268e6f499fca2912488e89fc8b6734cafbe24a4ecbcd3312e4eb27ed8e5cfb4f3": {
    name: "L2-Labs #2",
    slug: "l2-labs-2",
    logo: "/logos/l2-labs.webp",
    website: "https://bitcoinl2labs.com/",
  },
  "0x038cb1e945144ca7669b0f33656b8379bcb3c17795b4d8665e42dea76eb3f86d2f": {
    name: "L2-Labs #3",
    slug: "l2-labs-3",
    logo: "/logos/l2-labs.webp",
    website: "https://bitcoinl2labs.com/",
  },
};
