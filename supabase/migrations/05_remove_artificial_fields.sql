-- Remove artificial fields that are not actually extracted from SQDGN messages
-- These fields were being set to default values rather than parsed from real data

-- Remove columns that contain artificial data
ALTER TABLE calls DROP COLUMN IF EXISTS signal_type;
ALTER TABLE calls DROP COLUMN IF EXISTS target_multiplier;
ALTER TABLE calls DROP COLUMN IF EXISTS risk_level;
ALTER TABLE calls DROP COLUMN IF EXISTS entry_price;
ALTER TABLE calls DROP COLUMN IF EXISTS confidence;

-- Keep is_valid but make it simply based on whether parsing was successful
-- Update the calls_with_performance view
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

-- Add comment to clarify what is_valid means
COMMENT ON COLUMN calls.is_valid IS 'Whether the message was successfully parsed and contains required fields (token_symbol)';