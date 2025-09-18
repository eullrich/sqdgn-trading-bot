-- Simplified price snapshots table that matches DexScreener API exactly
-- This replaces the OHLCV candle approach with point-in-time price snapshots

-- Drop the old candles table if we want to start fresh
-- DROP TABLE IF EXISTS token_candles_5m;

-- Create simplified price snapshots table
CREATE TABLE IF NOT EXISTS token_price_snapshots_5m (
  time              TIMESTAMPTZ NOT NULL,
  token_address     TEXT        NOT NULL,
  price_usd         DOUBLE PRECISION NOT NULL,
  price_native      DOUBLE PRECISION,
  volume_5m         DOUBLE PRECISION,
  volume_1h         DOUBLE PRECISION,
  volume_24h        DOUBLE PRECISION,
  liquidity_usd     DOUBLE PRECISION,
  market_cap        DOUBLE PRECISION,
  price_change_5m   DOUBLE PRECISION,
  price_change_1h   DOUBLE PRECISION,
  price_change_24h  DOUBLE PRECISION,
  txn_buys_5m       INTEGER,
  txn_sells_5m      INTEGER,
  dex_id            TEXT,
  pair_address      TEXT,
  source            TEXT DEFAULT 'dexscreener',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (time, token_address)
);

-- Create hypertable if TimescaleDB is available
DO $$
BEGIN
  PERFORM create_hypertable('token_price_snapshots_5m', 'time', if_not_exists => TRUE);
  RAISE NOTICE 'TimescaleDB hypertable created for token_price_snapshots_5m';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'TimescaleDB not available, using regular table: %', SQLERRM;
END;
$$;

-- Essential indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_price_snapshots_token_time ON token_price_snapshots_5m (token_address, time DESC);
CREATE INDEX IF NOT EXISTS idx_price_snapshots_time ON token_price_snapshots_5m (time DESC);
CREATE INDEX IF NOT EXISTS idx_price_snapshots_source ON token_price_snapshots_5m (source);
CREATE INDEX IF NOT EXISTS idx_price_snapshots_dex ON token_price_snapshots_5m (dex_id);

-- Update ingestion_runs table to track the new data type
ALTER TABLE ingestion_runs ADD COLUMN IF NOT EXISTS data_type TEXT DEFAULT 'candles';

-- Add comments for documentation
COMMENT ON TABLE token_price_snapshots_5m IS 'Point-in-time price snapshots from DexScreener API, captured every 5 minutes';
COMMENT ON COLUMN token_price_snapshots_5m.price_usd IS 'Current token price in USD at snapshot time';
COMMENT ON COLUMN token_price_snapshots_5m.price_native IS 'Token price in native quote token (SOL, USDC, etc.)';
COMMENT ON COLUMN token_price_snapshots_5m.volume_5m IS '5-minute trading volume from DexScreener';
COMMENT ON COLUMN token_price_snapshots_5m.liquidity_usd IS 'Total liquidity in USD for the trading pair';
COMMENT ON COLUMN token_price_snapshots_5m.market_cap IS 'Market capitalization at snapshot time';
COMMENT ON COLUMN token_price_snapshots_5m.txn_buys_5m IS 'Number of buy transactions in last 5 minutes';
COMMENT ON COLUMN token_price_snapshots_5m.txn_sells_5m IS 'Number of sell transactions in last 5 minutes';
COMMENT ON COLUMN token_price_snapshots_5m.dex_id IS 'DEX identifier (raydium, meteora, orca, etc.)';
COMMENT ON COLUMN token_price_snapshots_5m.pair_address IS 'Trading pair contract address';

-- Function to get latest price snapshot for a token
CREATE OR REPLACE FUNCTION get_latest_price_snapshot(token_addr TEXT)
RETURNS TABLE(
  price_usd DOUBLE PRECISION,
  price_change_24h DOUBLE PRECISION,
  volume_24h DOUBLE PRECISION,
  market_cap DOUBLE PRECISION,
  last_updated TIMESTAMPTZ
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.price_usd,
    p.price_change_24h,
    p.volume_24h,
    p.market_cap,
    p.time
  FROM token_price_snapshots_5m p
  WHERE p.token_address = token_addr
  ORDER BY p.time DESC
  LIMIT 1;
END;
$$;

-- Function to get price history for charting
CREATE OR REPLACE FUNCTION get_price_history(
  token_addr TEXT, 
  hours_back INTEGER DEFAULT 24,
  max_points INTEGER DEFAULT 288  -- 5min intervals for 24h = 288 points
)
RETURNS TABLE(
  time TIMESTAMPTZ,
  price_usd DOUBLE PRECISION,
  volume_5m DOUBLE PRECISION
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.time,
    p.price_usd,
    p.volume_5m
  FROM token_price_snapshots_5m p
  WHERE p.token_address = token_addr
    AND p.time >= (NOW() - INTERVAL '1 hour' * hours_back)
  ORDER BY p.time ASC
  LIMIT max_points;
END;
$$;

-- Function to clean old snapshots (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_snapshots(days_to_keep INTEGER DEFAULT 7)
RETURNS INTEGER
LANGUAGE plpgsql AS $$
DECLARE
  rows_deleted INTEGER;
BEGIN
  DELETE FROM token_price_snapshots_5m 
  WHERE time < (NOW() - INTERVAL '1 day' * days_to_keep);
  
  GET DIAGNOSTICS rows_deleted = ROW_COUNT;
  
  INSERT INTO ingestion_runs (ok, tokens_processed, rows_inserted, data_type, error_message)
  VALUES (TRUE, 0, -rows_deleted, 'snapshots', 'Cleanup: ' || rows_deleted || ' old snapshots removed');
  
  RETURN rows_deleted;
END;
$$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON token_price_snapshots_5m TO authenticated;
GRANT EXECUTE ON FUNCTION get_latest_price_snapshot(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_price_history(TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_snapshots(INTEGER) TO authenticated;

-- Add RLS policies
ALTER TABLE token_price_snapshots_5m ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users
CREATE POLICY "Allow read access to token_price_snapshots_5m" ON token_price_snapshots_5m
  FOR SELECT TO authenticated
  USING (true);

-- Allow service role to do everything (for Edge Functions)
CREATE POLICY "Service role full access to token_price_snapshots_5m" ON token_price_snapshots_5m
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);