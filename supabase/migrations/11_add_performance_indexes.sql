-- Add indexes for performance optimization

-- Calls table indexes
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_contract_address ON calls(contract_address);
CREATE INDEX IF NOT EXISTS idx_calls_token_symbol ON calls(token_symbol);
CREATE INDEX IF NOT EXISTS idx_calls_is_valid ON calls(is_valid);
CREATE INDEX IF NOT EXISTS idx_calls_call_type ON calls(call_type);
CREATE INDEX IF NOT EXISTS idx_calls_sqdgn_label ON calls(sqdgn_label);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_calls_valid_created ON calls(is_valid, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_address_created ON calls(contract_address, created_at DESC);

-- Price snapshots indexes
CREATE INDEX IF NOT EXISTS idx_snapshots_token_time ON token_price_snapshots_5m(token_address, time DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_time ON token_price_snapshots_5m(time DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_token ON token_price_snapshots_5m(token_address);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- Partial indexes for specific conditions
CREATE INDEX IF NOT EXISTS idx_calls_valid_with_address ON calls(contract_address, created_at DESC) 
  WHERE is_valid = true AND contract_address IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_calls_recent_valid ON calls(created_at DESC) 
  WHERE is_valid = true AND created_at > NOW() - INTERVAL '7 days';

-- Function to get call performance metrics
CREATE OR REPLACE FUNCTION get_call_performance(
  p_days INTEGER DEFAULT 7
) RETURNS TABLE (
  total_calls BIGINT,
  successful_calls BIGINT,
  win_rate NUMERIC,
  average_roi NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_calls,
    COUNT(*) FILTER (WHERE current_market_cap > initial_market_cap) as successful_calls,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        (COUNT(*) FILTER (WHERE current_market_cap > initial_market_cap)::NUMERIC / COUNT(*)) * 100
      ELSE 0
    END as win_rate,
    AVG(
      CASE 
        WHEN initial_market_cap > 0 THEN 
          ((current_market_cap - initial_market_cap) / initial_market_cap) * 100
        ELSE NULL
      END
    ) as average_roi
  FROM calls
  WHERE 
    is_valid = true
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL
    AND initial_market_cap IS NOT NULL
    AND current_market_cap IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to get top performing tokens
CREATE OR REPLACE FUNCTION get_top_performers(
  p_limit INTEGER DEFAULT 10,
  p_days INTEGER DEFAULT 7
) RETURNS TABLE (
  token_symbol TEXT,
  token_address TEXT,
  roi NUMERIC,
  price_change NUMERIC,
  call_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.token_symbol,
    c.contract_address as token_address,
    AVG(
      CASE 
        WHEN c.initial_market_cap > 0 THEN 
          ((c.current_market_cap - c.initial_market_cap) / c.initial_market_cap) * 100
        ELSE 0
      END
    ) as roi,
    AVG(
      CASE 
        WHEN c.initial_price_usd > 0 THEN 
          ((c.current_price_usd - c.initial_price_usd) / c.initial_price_usd) * 100
        ELSE 0
      END
    ) as price_change,
    COUNT(*) as call_count
  FROM calls c
  WHERE 
    c.is_valid = true
    AND c.created_at >= NOW() - (p_days || ' days')::INTERVAL
    AND c.contract_address IS NOT NULL
  GROUP BY c.token_symbol, c.contract_address
  ORDER BY roi DESC NULLS LAST
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Materialized view for frequently accessed analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_token_stats AS
SELECT
  contract_address,
  token_symbol,
  COUNT(*) as total_calls,
  COUNT(*) FILTER (WHERE is_valid = true) as valid_calls,
  MIN(created_at) as first_call_date,
  MAX(created_at) as last_call_date,
  AVG(
    CASE 
      WHEN initial_market_cap > 0 AND current_market_cap > 0 THEN 
        ((current_market_cap - initial_market_cap) / initial_market_cap) * 100
      ELSE NULL
    END
  ) as average_roi,
  MAX(current_price_usd) as latest_price,
  MAX(current_market_cap) as latest_market_cap
FROM calls
WHERE contract_address IS NOT NULL
GROUP BY contract_address, token_symbol;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_mv_token_stats_address ON mv_token_stats(contract_address);
CREATE INDEX IF NOT EXISTS idx_mv_token_stats_symbol ON mv_token_stats(token_symbol);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_token_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_token_stats;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh (would need pg_cron extension or external scheduler)
-- This is just a comment for documentation:
-- Schedule this function to run every hour:
-- SELECT cron.schedule('refresh-token-stats', '0 * * * *', 'SELECT refresh_token_stats();');