import {
  index,
  integer,
  pgTable,
  primaryKey,
  varchar,
  customType,
  bigint,
} from 'drizzle-orm/pg-core';

const currency = customType<{ data: number }>({
  dataType() {
    return 'numeric(16, 6)';
  },
  fromDriver(value) {
    return Number(value);
  },
});

export const blocks = pgTable(
  'blocks',
  {
    blockHeight: integer('block_height').notNull(),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.blockHeight] }),
      createdIdx: index('created_at_idx').on(table.blockHeight),
    };
  }
);

export const signers = pgTable(
  'signers',
  {
    cycleNumber: integer('cycle_number').notNull(),
    signerKey: varchar('signer_key').notNull(),
    stackersCount: integer('stackers_count').notNull().default(0),
    stackedAmount: currency('stacked_amount').notNull().default(0),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.cycleNumber, table.signerKey] }),
      cycleNumberIndex: index('signers_idx_cycle_number').on(table.cycleNumber),
      signerKeyIndex: index('signers_idx_signer_key').on(table.signerKey),
    };
  }
);

export const stackers = pgTable(
  'stackers',
  {
    cycleNumber: integer('cycle_number').notNull(),
    signerKey: varchar('signer_key').notNull(),
    stackerAddress: varchar('stacker_address').notNull().default(''),
    stackedAmount: currency('stacked_amount').notNull().default(0),
    poxAddress: varchar('pox_address').notNull().default(''),
    stackerType: varchar('stacker_type').notNull().default('pooled'),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.cycleNumber, table.signerKey, table.stackerAddress] }),
      cycleNumberIndex: index('stackers_idx_cycle_number').on(table.cycleNumber),
      signerKeyIndex: index('stackers_idx_signer_key').on(table.signerKey),
      stackerAddressIndex: index('stackers_idx_stacker_address').on(table.stackerAddress),
      poxAddressIndex: index('stackers_idx_pox_address').on(table.poxAddress),
    };
  }
);

export const rewards = pgTable(
  'rewards',
  {
    cycleNumber: integer('cycle_number').notNull(),
    burnBlockHeight: integer('burn_block_height').notNull(),
    rewardRecipient: varchar('reward_recipient').notNull(),
    rewardAmount: currency('reward_amount').notNull().default(0),
  },
  table => {
    return {
      pk: primaryKey({
        columns: [table.cycleNumber, table.burnBlockHeight, table.rewardRecipient],
      }),
      cycleNumberIndex: index('rewards_idx_cycle_number').on(table.cycleNumber),
      rewardRecipientIndex: index('rewards_idx_reward_recipient').on(table.rewardRecipient),
      burnBlockHeightIndex: index('rewards_idx_burn_block_height').on(table.burnBlockHeight),
    };
  }
);

export const stackersRewards = pgTable(
  'stackers_rewards',
  {
    cycleNumber: integer('cycle_number').notNull(),
    signerKey: varchar('signer_key').notNull(),
    stackerAddress: varchar('stacker_address').notNull(),
    rewardAmount: currency('reward_amount').notNull().default(0),
  },
  table => {
    return {
      pk: primaryKey({
        columns: [table.cycleNumber, table.signerKey, table.stackerAddress],
      }),
      cycleNumberIndex: index('stackers_rewards_idx_cycle_number').on(table.cycleNumber),
      signerKeyIndex: index('stackersrewards__idx_signer_key').on(table.signerKey),
      stackerAddressIndex: index('stackers_rewards_idx_stacker_address').on(table.stackerAddress),
    };
  }
);

export const miners = pgTable(
  'miners',
  {
    blockHeight: integer('block_height').notNull(),
    bitcoinAddress: varchar('bitcoin_address').notNull(),
    rewardAmount: currency('reward_amount').notNull().default(0),
    feesAmount: currency('fees_amount').notNull().default(0),
  },
  table => {
    return {
      pk: primaryKey({
        columns: [table.blockHeight, table.bitcoinAddress],
      }),
      blockHeightIndex: index('miners_idx_block_height').on(table.blockHeight),
      bitcoinAddressIndex: index('miners_idx_bitcoin_address').on(table.bitcoinAddress),
    };
  }
);

export const minersBids = pgTable(
  'miners_bids',
  {
    blockHeight: integer('block_height').notNull(),
    bitcoinAddress: varchar('bitcoin_address').notNull(),
    bidAmount: currency('bid_amount').notNull().default(0),
    feeAmount: currency('fee_amount').notNull().default(0),
  },
  table => {
    return {
      pk: primaryKey({
        columns: [table.blockHeight, table.bitcoinAddress],
      }),
      blockHeightIndex: index('miners_bids_idx_block_height').on(table.blockHeight),
      bitcoinAddressIndex: index('miners_bids_idx_bitcoin_address').on(table.bitcoinAddress),
    };
  }
);

export const telegramChats = pgTable(
  'telegram_chats',
  {
    chatId: bigint('chat_id', { mode: 'bigint' }).notNull(),
    addresses: varchar('addresses'),
    notificationCycle: integer('notification_cycle'),
    blockStackingDaoRewards: integer('block_stackingdao_rewards').default(884163),
  },
  table => {
    return {
      pk: primaryKey({
        columns: [table.chatId],
      }),
      chatIdIndex: index('telegram_chats_idx_chat_id').on(table.chatId),
    };
  }
);

export const cyclePrices = pgTable(
  'cycle_prices',
  {
    cycle: integer('cycle').notNull(),
    symbol: varchar('symbol'),
    price: currency('price').notNull().default(0),
  },
  table => {
    return {
      pk: primaryKey({
        columns: [table.cycle, table.symbol],
      }),
      cycleIndex: index('cycle_prices_idx_cycle').on(table.cycle),
      symbolIndex: index('cycle_prices_idx_symbol').on(table.symbol),
    };
  }
);
