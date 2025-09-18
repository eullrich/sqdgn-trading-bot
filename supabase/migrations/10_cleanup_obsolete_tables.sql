-- Drop obsolete database tables that have been replaced by the new price snapshot system
-- This will save significant storage space and reduce schema complexity

-- 1. Drop token_candles_5m table (10,106 rows)
-- This table stored OHLCV candle data from Birdeye API but has been replaced 
-- by token_price_snapshots_5m which uses DexScreener API with simpler point-in-time data

DROP TABLE IF EXISTS token_candles_5m CASCADE;

-- Clean up any functions that might reference the old table
DROP FUNCTION IF EXISTS get_active_token_addresses(INTEGER);
DROP FUNCTION IF EXISTS cleanup_old_candles(INTEGER);

-- Recreate get_active_token_addresses function to work with the calls table only
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

-- 2. Drop token_prices table (151 rows) 
-- This table stored individual price lookups tied to specific calls
-- The functionality has been moved to updating calls.current_price_usd directly
-- and the new price snapshot system provides better ongoing price tracking

DROP TABLE IF EXISTS token_prices CASCADE;

-- Update any API endpoints or functions that might have referenced token_prices
-- The /api/prices/fetch endpoint will need to be updated to remove GET functionality
-- that depends on this table, but the core POST functionality (updating calls) remains intact

-- Add cleanup function for the new price snapshots table
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

-- Grant permissions on the updated function
GRANT EXECUTE ON FUNCTION get_active_token_addresses(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_snapshots(INTEGER) TO authenticated;

-- Add comment about the cleanup
COMMENT ON FUNCTION get_active_token_addresses IS 'Updated function to get active tokens from calls table only, after removing token_candles_5m dependency';

-- Log this cleanup operation
INSERT INTO audit_logs (event_type, entity_type, details) 
VALUES (
  'schema_cleanup', 
  'tables', 
  '{"action": "drop_obsolete_tables", "tables_dropped": ["token_candles_5m", "token_prices"], "rows_freed": "~10257", "reason": "replaced_by_price_snapshots"}'
);