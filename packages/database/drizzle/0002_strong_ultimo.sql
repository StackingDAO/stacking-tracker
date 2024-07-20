CREATE TABLE IF NOT EXISTS "stackers_rewards" (
	"cycle_number" integer NOT NULL,
	"signer_key" varchar NOT NULL,
	"stacker_address" varchar NOT NULL,
	"reward_amount" numeric(16, 6) DEFAULT 0 NOT NULL,
	CONSTRAINT "stackers_rewards_cycle_number_signer_key_stacker_address_pk" PRIMARY KEY("cycle_number","signer_key","stacker_address")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stackers_rewards_idx_cycle_number" ON "stackers_rewards" ("cycle_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stackersrewards__idx_signer_key" ON "stackers_rewards" ("signer_key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stackers_rewards_idx_stacker_address" ON "stackers_rewards" ("stacker_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stackers_idx_stacker_address" ON "stackers" ("stacker_address");