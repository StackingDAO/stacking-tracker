ALTER TABLE "telegram_chats" ALTER COLUMN "chat_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "telegram_chats" ALTER COLUMN "addresses" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "telegram_chats" ADD COLUMN "notification_cycle" integer;