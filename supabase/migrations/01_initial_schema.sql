-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create calls table
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    message_id TEXT NOT NULL UNIQUE,
    raw_message TEXT NOT NULL,
    token_symbol TEXT,
    signal_type TEXT CHECK (signal_type IN ('BUY', 'SELL', 'LONG', 'SHORT', 'HOLD')),
    entry_price DECIMAL(20, 8),
    target_multiplier DECIMAL(10, 2),
    risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    confidence DECIMAL(3, 2) CHECK (confidence >= 0 AND confidence <= 1),
    parsed_at TIMESTAMPTZ DEFAULT now(),
    is_valid BOOLEAN DEFAULT true,
    metadata JSONB
);

-- Create performance_metrics table
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    outcome TEXT CHECK (outcome IN ('WIN', 'LOSS', 'PENDING', 'CANCELLED')),
    actual_multiplier DECIMAL(10, 2),
    pnl_percentage DECIMAL(8, 4),
    execution_price DECIMAL(20, 8),
    exit_price DECIMAL(20, 8),
    duration_hours INTEGER,
    calculated_at TIMESTAMPTZ DEFAULT now(),
    is_simulation BOOLEAN DEFAULT true,
    notes TEXT
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    user_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX idx_calls_token_symbol ON calls(token_symbol);
CREATE INDEX idx_calls_signal_type ON calls(signal_type);
CREATE INDEX idx_calls_is_valid ON calls(is_valid);
CREATE INDEX idx_calls_parsed_at ON calls(parsed_at DESC);

CREATE INDEX idx_performance_call_id ON performance_metrics(call_id);
CREATE INDEX idx_performance_outcome ON performance_metrics(outcome);
CREATE INDEX idx_performance_calculated_at ON performance_metrics(calculated_at DESC);
CREATE INDEX idx_performance_is_simulation ON performance_metrics(is_simulation);

CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);

-- Create compound indexes for common queries
CREATE INDEX idx_calls_token_valid ON calls(token_symbol, is_valid) WHERE is_valid = true;
CREATE INDEX idx_performance_outcome_simulation ON performance_metrics(outcome, is_simulation);

-- Enable Row Level Security (RLS)
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - to be refined based on auth requirements)
CREATE POLICY "Enable all operations for authenticated users" ON calls
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON performance_metrics
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON audit_logs
    FOR ALL USING (true);

-- Create helpful views
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

-- Create a function to calculate win rate
CREATE OR REPLACE FUNCTION calculate_win_rate(
    p_token_symbol TEXT DEFAULT NULL,
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
) RETURNS DECIMAL AS $$
DECLARE
    win_rate DECIMAL;
BEGIN
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND((COUNT(*) FILTER (WHERE pm.outcome = 'WIN')::DECIMAL / COUNT(*)) * 100, 2)
        END
    INTO win_rate
    FROM calls c
    JOIN performance_metrics pm ON c.id = pm.call_id
    WHERE 
        (p_token_symbol IS NULL OR c.token_symbol = p_token_symbol)
        AND (p_start_date IS NULL OR c.created_at >= p_start_date)
        AND (p_end_date IS NULL OR c.created_at <= p_end_date)
        AND c.is_valid = true
        AND pm.outcome IN ('WIN', 'LOSS');
    
    RETURN COALESCE(win_rate, 0);
END;
$$ LANGUAGE plpgsql;