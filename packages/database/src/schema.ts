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
      pk: primaryKey({ columns: [table.cycleNumber, table.rewardRecipient] }),
      cycleNumberIndex: index('rewards_idx_cycle_number').on(table.cycleNumber).asc(),
      rewardRecipientIndex: index('rewards_idx_reward_recipient').on(table.rewardRecipient).asc(),
      burnBlockHeightIndex: index('rewards_idx_burn_block_height').on(table.burnBlockHeight).asc(),
    };
  }
);
