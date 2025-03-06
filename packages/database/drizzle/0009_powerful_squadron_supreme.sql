CREATE TABLE "cycle_prices" (
	"cycle" integer NOT NULL,
	"symbol" varchar,
	"price" numeric(16, 6) DEFAULT 0 NOT NULL,
	CONSTRAINT "cycle_prices_cycle_symbol_pk" PRIMARY KEY("cycle","symbol")
);
--> statement-breakpoint
CREATE INDEX "cycle_prices_idx_cycle" ON "cycle_prices" USING btree ("cycle");--> statement-breakpoint
CREATE INDEX "cycle_prices_idx_symbol" ON "cycle_prices" USING btree ("symbol");