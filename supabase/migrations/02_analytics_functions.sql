-- Create function to get dashboard metrics
CREATE OR REPLACE FUNCTION get_dashboard_metrics(
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL,
    p_token_symbol TEXT DEFAULT NULL
)
RETURNS TABLE (
    total_calls BIGINT,
    valid_calls BIGINT,
    win_rate DECIMAL,
    avg_multiplier DECIMAL,
    total_pnl DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_calls,
        COUNT(*) FILTER (WHERE c.is_valid = true)::BIGINT as valid_calls,
        COALESCE(
            ROUND(
                (COUNT(*) FILTER (WHERE pm.outcome = 'WIN')::DECIMAL / 
                 NULLIF(COUNT(*) FILTER (WHERE pm.outcome IN ('WIN', 'LOSS')), 0)) * 100, 
                2
            ), 
            0
        ) as win_rate,
        COALESCE(
            ROUND(AVG(pm.actual_multiplier), 2), 
            0
        ) as avg_multiplier,
        COALESCE(
            ROUND(SUM(
                CASE 
                    WHEN pm.outcome = 'WIN' THEN (pm.actual_multiplier - 1) * 100
                    WHEN pm.outcome = 'LOSS' THEN -100
                    ELSE 0
                END
            ), 2),
            0
        ) as total_pnl
    FROM calls c
    LEFT JOIN performance_metrics pm ON c.id = pm.call_id
    WHERE 
        (p_start_date IS NULL OR c.created_at >= p_start_date)
        AND (p_end_date IS NULL OR c.created_at <= p_end_date)
        AND (p_token_symbol IS NULL OR c.token_symbol = p_token_symbol)
        AND c.is_valid = true;
END;
$$ LANGUAGE plpgsql;

-- Create function to get token performance
CREATE OR REPLACE FUNCTION get_token_performance(
    p_limit INTEGER DEFAULT 20,
    p_min_calls INTEGER DEFAULT 3
)
RETURNS TABLE (
    token_symbol TEXT,
    total_calls BIGINT,
    valid_calls BIGINT,
    win_rate DECIMAL,
    avg_multiplier DECIMAL,
    total_pnl DECIMAL,
    last_call_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.token_symbol,
        COUNT(*)::BIGINT as total_calls,
        COUNT(*) FILTER (WHERE c.is_valid = true)::BIGINT as valid_calls,
        COALESCE(
            ROUND(
                (COUNT(*) FILTER (WHERE pm.outcome = 'WIN')::DECIMAL / 
                 NULLIF(COUNT(*) FILTER (WHERE pm.outcome IN ('WIN', 'LOSS')), 0)) * 100, 
                2
            ), 
            0
        ) as win_rate,
        COALESCE(
            ROUND(AVG(pm.actual_multiplier) FILTER (WHERE pm.actual_multiplier IS NOT NULL), 2), 
            0
        ) as avg_multiplier,
        COALESCE(
            ROUND(SUM(
                CASE 
                    WHEN pm.outcome = 'WIN' THEN (pm.actual_multiplier - 1) * 100
                    WHEN pm.outcome = 'LOSS' THEN -100
                    ELSE 0
                END
            ), 2),
            0
        ) as total_pnl,
        MAX(c.created_at) as last_call_at
    FROM calls c
    LEFT JOIN performance_metrics pm ON c.id = pm.call_id
    WHERE c.token_symbol IS NOT NULL
    GROUP BY c.token_symbol
    HAVING COUNT(*) >= p_min_calls
    ORDER BY COUNT(*) DESC, win_rate DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Create function for time-series analytics
CREATE OR REPLACE FUNCTION get_daily_metrics(
    p_days INTEGER DEFAULT 30,
    p_token_symbol TEXT DEFAULT NULL
)
RETURNS TABLE (
    date DATE,
    total_calls BIGINT,
    valid_calls BIGINT,
    win_rate DECIMAL,
    avg_multiplier DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.created_at::DATE as date,
        COUNT(*)::BIGINT as total_calls,
        COUNT(*) FILTER (WHERE c.is_valid = true)::BIGINT as valid_calls,
        COALESCE(
            ROUND(
                (COUNT(*) FILTER (WHERE pm.outcome = 'WIN')::DECIMAL / 
                 NULLIF(COUNT(*) FILTER (WHERE pm.outcome IN ('WIN', 'LOSS')), 0)) * 100, 
                2
            ), 
            0
        ) as win_rate,
        COALESCE(
            ROUND(AVG(pm.actual_multiplier) FILTER (WHERE pm.actual_multiplier IS NOT NULL), 2), 
            0
        ) as avg_multiplier
    FROM calls c
    LEFT JOIN performance_metrics pm ON c.id = pm.call_id
    WHERE 
        c.created_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL 
        AND (p_token_symbol IS NULL OR c.token_symbol = p_token_symbol)
    GROUP BY c.created_at::DATE
    ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for analytics performance
CREATE INDEX IF NOT EXISTS idx_calls_created_date ON calls(created_at::DATE);
CREATE INDEX IF NOT EXISTS idx_performance_outcome_multiplier ON performance_metrics(outcome, actual_multiplier);

-- Create materialized view for faster analytics (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_call_summary AS
SELECT 
    created_at::DATE as date,
    token_symbol,
    COUNT(*) as total_calls,
    COUNT(*) FILTER (WHERE is_valid = true) as valid_calls,
    AVG(confidence) FILTER (WHERE is_valid = true) as avg_confidence,
    array_agg(DISTINCT signal_type) FILTER (WHERE signal_type IS NOT NULL) as signal_types,
    array_agg(DISTINCT risk_level) FILTER (WHERE risk_level IS NOT NULL) as risk_levels
FROM calls
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY created_at::DATE, token_symbol
ORDER BY date DESC, total_calls DESC;

-- Create unique index for the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_call_summary_unique 
ON daily_call_summary(date, COALESCE(token_symbol, ''));

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_daily_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_call_summary;
END;
$$ LANGUAGE plpgsql;