CREATE TABLE IF NOT EXISTS "blocks" (
	"block_height" integer NOT NULL,
	CONSTRAINT "blocks_block_height_pk" PRIMARY KEY("block_height")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "blocks" ("block_height");