-- Add dedicated columns for all SQDGN metadata fields
ALTER TABLE calls ADD COLUMN IF NOT EXISTS token_name TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS contract_address TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS blockchain TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS sqdgn_label TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS creation_date TIMESTAMPTZ;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS token_age TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS market_cap DECIMAL(20, 2);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS liquidity DECIMAL(20, 2);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS volume_24h DECIMAL(20, 2);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS dex_screener_url TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS jupiter_url TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS raydium_url TEXT;

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_calls_token_name ON calls(token_name);
CREATE INDEX IF NOT EXISTS idx_calls_contract_address ON calls(contract_address);
CREATE INDEX IF NOT EXISTS idx_calls_blockchain ON calls(blockchain);
CREATE INDEX IF NOT EXISTS idx_calls_sqdgn_label ON calls(sqdgn_label);
CREATE INDEX IF NOT EXISTS idx_calls_creation_date ON calls(creation_date DESC);
CREATE INDEX IF NOT EXISTS idx_calls_market_cap ON calls(market_cap DESC);
CREATE INDEX IF NOT EXISTS idx_calls_liquidity ON calls(liquidity DESC);
CREATE INDEX IF NOT EXISTS idx_calls_volume_24h ON calls(volume_24h DESC);

-- Add compound indexes for advanced filtering
CREATE INDEX IF NOT EXISTS idx_calls_blockchain_label ON calls(blockchain, sqdgn_label);
CREATE INDEX IF NOT EXISTS idx_calls_market_cap_liquidity ON calls(market_cap DESC, liquidity DESC);

-- Update the calls_with_performance view to include new columns
DROP VIEW IF EXISTS calls_with_performance;
CREATE VIEW calls_with_performance AS
SELECT 
    c.*,
    pm.outcome,
    pm.actual_multiplier,
    pm.pnl_percentage,
    pm.duration_hours,
    pm.is_simulation
FROM calls c
LEFT JOIN performance_metrics pm ON c.id = pm.call_id;