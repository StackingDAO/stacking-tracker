CREATE TABLE IF NOT EXISTS "rewards" (
	"cycle_number" integer NOT NULL,
	"burn_block_height" integer NOT NULL,
	"reward_recipient" varchar NOT NULL,
	"reward_amount" numeric(16, 6) DEFAULT 0 NOT NULL,
	CONSTRAINT "rewards_cycle_number_burn_block_height_reward_recipient_pk" PRIMARY KEY("cycle_number","burn_block_height","reward_recipient")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "signers" (
	"cycle_number" integer NOT NULL,
	"signer_key" varchar NOT NULL,
	"stackers_count" integer DEFAULT 0 NOT NULL,
	"stacked_amount" numeric(16, 6) DEFAULT 0 NOT NULL,
	CONSTRAINT "signers_cycle_number_signer_key_pk" PRIMARY KEY("cycle_number","signer_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stackers" (
	"cycle_number" integer NOT NULL,
	"signer_key" varchar NOT NULL,
	"stacker_address" varchar DEFAULT '' NOT NULL,
	"stacked_amount" numeric(16, 6) DEFAULT 0 NOT NULL,
	"pox_address" varchar DEFAULT '' NOT NULL,
	"stacker_type" varchar DEFAULT 'pooled' NOT NULL,
	CONSTRAINT "stackers_cycle_number_signer_key_stacker_address_pk" PRIMARY KEY("cycle_number","signer_key","stacker_address")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rewards_idx_cycle_number" ON "rewards" ("cycle_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rewards_idx_reward_recipient" ON "rewards" ("reward_recipient");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rewards_idx_burn_block_height" ON "rewards" ("burn_block_height");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "signers_idx_cycle_number" ON "signers" ("cycle_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "signers_idx_signer_key" ON "signers" ("signer_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stackers_idx_cycle_number" ON "stackers" ("cycle_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stackers_idx_signer_key" ON "stackers" ("signer_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stackers_idx_pox_address" ON "stackers" ("pox_address");