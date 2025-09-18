-- Stop Loss/Take Profit MVP: 5-minute candle data for Solana tokens
-- Day 1: Database schema creation

-- Enable TimescaleDB if available (optional, works without it)
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create 5-minute candle data table
CREATE TABLE IF NOT EXISTS token_candles_5m (
  time          TIMESTAMPTZ NOT NULL,
  token_address TEXT        NOT NULL,
  open          DOUBLE PRECISION NOT NULL,
  high          DOUBLE PRECISION NOT NULL,
  low           DOUBLE PRECISION NOT NULL,
  close         DOUBLE PRECISION NOT NULL,
  base_volume   DOUBLE PRECISION,
  quote_volume  DOUBLE PRECISION,
  source        TEXT DEFAULT 'birdeye',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (time, token_address)
);

-- Create hypertable if TimescaleDB is available (will fail gracefully if not)
DO $$
BEGIN
  PERFORM create_hypertable('token_candles_5m', 'time', if_not_exists => TRUE);
  RAISE NOTICE 'TimescaleDB hypertable created for token_candles_5m';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'TimescaleDB not available, using regular table: %', SQLERRM;
END;
$$;

-- Essential indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_token_candles_5m_token_time ON token_candles_5m (token_address, time DESC);
CREATE INDEX IF NOT EXISTS idx_token_candles_5m_time ON token_candles_5m (time DESC);
CREATE INDEX IF NOT EXISTS idx_token_candles_5m_source ON token_candles_5m (source);

-- Operational tracking table for data ingestion monitoring
CREATE TABLE IF NOT EXISTS ingestion_runs (
  run_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at        TIMESTAMPTZ DEFAULT NOW(),
  ended_at          TIMESTAMPTZ,
  ok                BOOLEAN,
  tokens_processed  INTEGER,
  rows_inserted     INTEGER,
  vendor_rate_status JSONB,
  error_message     TEXT
);

-- Index for ingestion monitoring queries
CREATE INDEX IF NOT EXISTS idx_ingestion_runs_started_at ON ingestion_runs (started_at DESC);

-- Add comments for documentation
COMMENT ON TABLE token_candles_5m IS 'Historical 5-minute OHLCV candle data for Solana tokens from Birdeye API';
COMMENT ON TABLE ingestion_runs IS 'Tracking table for data ingestion jobs and their status';

-- Function to get active token addresses from calls table
CREATE OR REPLACE FUNCTION get_active_token_addresses(days_back INTEGER DEFAULT 30)
RETURNS TABLE(token_address TEXT, symbol TEXT, call_count BIGINT)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.contract_address::TEXT,
    c.token_symbol::TEXT,
    COUNT(*)::BIGINT
  FROM calls c
  WHERE c.contract_address IS NOT NULL
    AND c.message_timestamp >= (NOW() - INTERVAL '1 day' * days_back)
  GROUP BY c.contract_address, c.token_symbol
  ORDER BY COUNT(*) DESC;
END;
$$;

-- Function to clean old candle data (retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_candles(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER
LANGUAGE plpgsql AS $$
DECLARE
  rows_deleted INTEGER;
BEGIN
  DELETE FROM token_candles_5m 
  WHERE time < (NOW() - INTERVAL '1 day' * days_to_keep);
  
  GET DIAGNOSTICS rows_deleted = ROW_COUNT;
  
  INSERT INTO ingestion_runs (ok, tokens_processed, rows_inserted, error_message)
  VALUES (TRUE, 0, -rows_deleted, 'Cleanup: ' || rows_deleted || ' old candles removed');
  
  RETURN rows_deleted;
END;
$$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON token_candles_5m TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ingestion_runs TO authenticated;
GRANT EXECUTE ON FUNCTION get_active_token_addresses(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_candles(INTEGER) TO authenticated;

-- Add RLS policies (basic security)
ALTER TABLE token_candles_5m ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_runs ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users
CREATE POLICY "Allow read access to token_candles_5m" ON token_candles_5m
  FOR SELECT TO authenticated
  USING (true);

-- Allow read access to ingestion runs for monitoring
CREATE POLICY "Allow read access to ingestion_runs" ON ingestion_runs
  FOR SELECT TO authenticated
  USING (true);

-- Allow service role to do everything (for Edge Functions)
CREATE POLICY "Service role full access to token_candles_5m" ON token_candles_5m
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access to ingestion_runs" ON ingestion_runs
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);