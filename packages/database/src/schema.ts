import { index, integer, pgTable, primaryKey, varchar, customType } from 'drizzle-orm/pg-core';

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
      createdIdx: index('created_at_idx').on(table.blockHeight).asc(),
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
      cycleNumberIndex: index('signers_idx_cycle_number').on(table.cycleNumber).asc(),
      signerKeyIndex: index('signers_idx_signer_key').on(table.signerKey).asc(),
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
      cycleNumberIndex: index('stackers_idx_cycle_number').on(table.cycleNumber).asc(),
      signerKeyIndex: index('stackers_idx_signer_key').on(table.signerKey).asc(),
      stackerAddressIndex: index('stackers_idx_stacker_address').on(table.stackerAddress).asc(),
      poxAddressIndex: index('stackers_idx_pox_address').on(table.poxAddress).asc(),
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
      cycleNumberIndex: index('rewards_idx_cycle_number').on(table.cycleNumber).asc(),
      rewardRecipientIndex: index('rewards_idx_reward_recipient').on(table.rewardRecipient).asc(),
      burnBlockHeightIndex: index('rewards_idx_burn_block_height').on(table.burnBlockHeight).asc(),
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
      cycleNumberIndex: index('stackers_rewards_idx_cycle_number').on(table.cycleNumber).asc(),
      signerKeyIndex: index('stackersrewards__idx_signer_key').on(table.signerKey).asc(),
      stackerAddressIndex: index('stackers_rewards_idx_stacker_address')
        .on(table.stackerAddress)
        .asc(),
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
      blockHeightIndex: index('miners_idx_block_height').on(table.blockHeight).asc(),
      bitcoinAddressIndex: index('miners_idx_bitcoin_address').on(table.bitcoinAddress).asc(),
    };
  }
);

export const minersBids = pgTable(
  'miners_bids',
  {
    blockHeight: integer('block_height').notNull(),
    bitcoinAddress: varchar('bitcoin_address').notNull(),
    bidAmount: currency('bid_amount').notNull().default(0),
  },
  table => {
    return {
      pk: primaryKey({
        columns: [table.blockHeight, table.bitcoinAddress],
      }),
      blockHeightIndex: index('miners_bids_idx_block_height').on(table.blockHeight).asc(),
      bitcoinAddressIndex: index('miners_bids_idx_bitcoin_address').on(table.bitcoinAddress).asc(),
    };
  }
);
