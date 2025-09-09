-- Migration to add call_type column to track different types of trading signals
-- Generated on 2025-01-05

-- Add call_type column to calls table
ALTER TABLE calls 
ADD COLUMN call_type TEXT;

-- Create an enum-like constraint for call types
ALTER TABLE calls 
ADD CONSTRAINT valid_call_types 
CHECK (call_type IN (
    'market_activity',
    'transaction_spotted', 
    'large_trade',
    'wallet_activity',
    'significant_transaction',
    'wallet_signal',
    'smart_money',
    'onchain_signal'
));

-- Add index for efficient filtering by call type
CREATE INDEX idx_calls_call_type ON calls(call_type);

-- Update the calls_with_performance view to include call_type
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

-- Add comment to document the call types
COMMENT ON COLUMN calls.call_type IS 'Type of trading signal: market_activity, transaction_spotted, large_trade, wallet_activity, significant_transaction, wallet_signal, smart_money, onchain_signal';