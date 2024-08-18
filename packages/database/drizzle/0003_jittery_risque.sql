CREATE TABLE IF NOT EXISTS "miners" (
	"block_height" integer NOT NULL,
	"bitcoin_address" varchar NOT NULL,
	"reward_amount" numeric(16, 6) DEFAULT 0 NOT NULL,
	"fees_amount" numeric(16, 6) DEFAULT 0 NOT NULL,
	CONSTRAINT "miners_block_height_bitcoin_address_pk" PRIMARY KEY("block_height","bitcoin_address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "miners_bids" (
	"block_height" integer NOT NULL,
	"bitcoin_address" varchar NOT NULL,
	"bid_amount" numeric(16, 6) DEFAULT 0 NOT NULL,
	CONSTRAINT "miners_bids_block_height_bitcoin_address_pk" PRIMARY KEY("block_height","bitcoin_address")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "miners_idx_block_height" ON "miners" ("block_height");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "miners_idx_bitcoin_address" ON "miners" ("bitcoin_address");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "miners_bids_idx_block_height" ON "miners_bids" ("block_height");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "miners_bids_idx_bitcoin_address" ON "miners_bids" ("bitcoin_address");