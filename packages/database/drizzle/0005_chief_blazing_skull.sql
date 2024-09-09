CREATE TABLE IF NOT EXISTS "telegram_chats" (
	"chat_id" integer NOT NULL,
	"addresses" varchar NOT NULL,
	CONSTRAINT "telegram_chats_chat_id_pk" PRIMARY KEY("chat_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "telegram_chats_idx_chat_id" ON "telegram_chats" ("chat_id");