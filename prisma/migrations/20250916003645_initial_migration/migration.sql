-- CreateTable
CREATE TABLE "public"."calls" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message_id" TEXT NOT NULL,
    "raw_message" TEXT NOT NULL,
    "message_timestamp" TIMESTAMP(3),
    "token_symbol" TEXT,
    "token_name" TEXT,
    "contract_address" TEXT,
    "blockchain" TEXT DEFAULT 'solana',
    "sqdgn_label" TEXT,
    "call_type" TEXT,
    "market_cap" DECIMAL(65,30),
    "liquidity" DECIMAL(65,30),
    "volume_24h" DECIMAL(65,30),
    "current_price_usd" DECIMAL(65,30),
    "price_updated_at" TIMESTAMP(3),
    "current_market_cap" DECIMAL(65,30),
    "market_cap_updated_at" TIMESTAMP(3),
    "dex_screener_url" TEXT,
    "jupiter_url" TEXT,
    "raydium_url" TEXT,
    "metadata" JSONB,
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "parsed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."token_price_snapshots_5m" (
    "time" TIMESTAMP(3) NOT NULL,
    "token_address" TEXT NOT NULL,
    "price_usd" DOUBLE PRECISION NOT NULL,
    "price_native" DOUBLE PRECISION,
    "market_cap" DOUBLE PRECISION,
    "volume_5m" DOUBLE PRECISION,
    "volume_1h" DOUBLE PRECISION,
    "volume_24h" DOUBLE PRECISION,
    "liquidity_usd" DOUBLE PRECISION,
    "price_change_5m" DOUBLE PRECISION,
    "price_change_1h" DOUBLE PRECISION,
    "price_change_24h" DOUBLE PRECISION,
    "txn_buys_5m" INTEGER,
    "txn_sells_5m" INTEGER,
    "dex_id" TEXT,
    "pair_address" TEXT,
    "source" TEXT NOT NULL DEFAULT 'dexscreener',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_price_snapshots_5m_pkey" PRIMARY KEY ("time","token_address")
);

-- CreateTable
CREATE TABLE "public"."trading_positions" (
    "id" TEXT NOT NULL,
    "user_wallet_address" TEXT NOT NULL,
    "token_address" TEXT NOT NULL,
    "token_symbol" TEXT,
    "entry_price" DECIMAL(65,30) NOT NULL,
    "entry_amount_sol" DECIMAL(65,30) NOT NULL,
    "entry_amount_tokens" DECIMAL(65,30) NOT NULL,
    "entry_tx_signature" TEXT,
    "current_price" DECIMAL(65,30),
    "current_value_sol" DECIMAL(65,30),
    "highest_price" DECIMAL(65,30),
    "realized_pnl_sol" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unrealized_pnl_sol" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unrealized_pnl_percentage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "stop_loss_price" DECIMAL(65,30),
    "take_profit_price" DECIMAL(65,30),
    "trailing_stop_percentage" DECIMAL(65,30),
    "exit_price" DECIMAL(65,30),
    "exit_amount_sol" DECIMAL(65,30),
    "exit_reason" TEXT,
    "exit_tx_signature" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "call_id" TEXT,

    CONSTRAINT "trading_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trailing_stops" (
    "id" TEXT NOT NULL,
    "position_id" TEXT,
    "highest_price" DECIMAL(65,30) NOT NULL,
    "current_stop_price" DECIMAL(65,30) NOT NULL,
    "trailing_percentage" DECIMAL(65,30) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "triggered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trailing_stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_trading_config" (
    "id" TEXT NOT NULL,
    "user_wallet_address" TEXT NOT NULL,
    "telegram_user_id" TEXT,
    "is_auto_buy_enabled" BOOLEAN NOT NULL DEFAULT false,
    "default_buy_amount_sol" DECIMAL(65,30) NOT NULL DEFAULT 0.1,
    "max_position_size_sol" DECIMAL(65,30) NOT NULL DEFAULT 1.0,
    "default_slippage_bps" INTEGER NOT NULL DEFAULT 100,
    "max_slippage_bps" INTEGER NOT NULL DEFAULT 500,
    "trailing_stop_enabled" BOOLEAN NOT NULL DEFAULT true,
    "trailing_stop_percentage" DECIMAL(65,30) NOT NULL DEFAULT 10.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_trading_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auto_buy_queue" (
    "id" TEXT NOT NULL,
    "user_wallet_address" TEXT NOT NULL,
    "call_id" TEXT,
    "token_address" TEXT,
    "token_symbol" TEXT NOT NULL,
    "buy_amount_sol" DECIMAL(65,30) NOT NULL,
    "max_price" DECIMAL(65,30),
    "slippage_bps" INTEGER DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "trade_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "auto_buy_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trade_history" (
    "id" TEXT NOT NULL,
    "position_id" TEXT,
    "user_wallet_address" TEXT NOT NULL,
    "token_address" TEXT NOT NULL,
    "token_symbol" TEXT,
    "trade_type" TEXT NOT NULL,
    "amount_sol" DECIMAL(65,30) NOT NULL,
    "amount_tokens" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "slippage_bps" INTEGER,
    "price_impact_pct" DECIMAL(65,30),
    "tx_signature" TEXT,
    "tx_status" TEXT NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "jupiter_quote" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3),

    CONSTRAINT "trade_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."price_alerts" (
    "id" TEXT NOT NULL,
    "position_id" TEXT,
    "user_wallet_address" TEXT NOT NULL,
    "token_address" TEXT NOT NULL,
    "alert_type" TEXT NOT NULL,
    "target_price" DECIMAL(65,30) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "triggered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_type" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "user_id" TEXT,
    "details" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ingestion_runs" (
    "run_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "ok" BOOLEAN,
    "tokens_processed" INTEGER,
    "rows_inserted" INTEGER,
    "vendor_rate_status" JSONB,
    "error_message" TEXT,
    "data_type" TEXT NOT NULL DEFAULT 'candles',

    CONSTRAINT "ingestion_runs_pkey" PRIMARY KEY ("run_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "calls_message_id_key" ON "public"."calls"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "trailing_stops_position_id_key" ON "public"."trailing_stops"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_trading_config_user_wallet_address_key" ON "public"."user_trading_config"("user_wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "trade_history_tx_signature_key" ON "public"."trade_history"("tx_signature");

-- AddForeignKey
ALTER TABLE "public"."trading_positions" ADD CONSTRAINT "trading_positions_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "public"."calls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trailing_stops" ADD CONSTRAINT "trailing_stops_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "public"."trading_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."auto_buy_queue" ADD CONSTRAINT "auto_buy_queue_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "public"."calls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."auto_buy_queue" ADD CONSTRAINT "auto_buy_queue_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "public"."trade_history"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trade_history" ADD CONSTRAINT "trade_history_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "public"."trading_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."price_alerts" ADD CONSTRAINT "price_alerts_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "public"."trading_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
