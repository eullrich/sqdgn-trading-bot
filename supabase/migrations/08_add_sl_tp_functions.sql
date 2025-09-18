-- Stop Loss/Take Profit MVP: Core SL/TP detection functions
-- Day 1: Database functions for SL/TP analysis

-- Core function to find the first candle that hits stop loss or take profit
CREATE OR REPLACE FUNCTION sl_tp_first_hit(
  p_token TEXT,
  p_entry_time TIMESTAMPTZ,
  p_entry_price DOUBLE PRECISION,
  p_stop_pct DOUBLE PRECISION,
  p_take_pct DOUBLE PRECISION
)
RETURNS TABLE(
  time TIMESTAMPTZ,
  open DOUBLE PRECISION,
  high DOUBLE PRECISION,
  low DOUBLE PRECISION,
  close DOUBLE PRECISION,
  hit_sl BOOLEAN,
  hit_tp BOOLEAN,
  stop_price DOUBLE PRECISION,
  take_price DOUBLE PRECISION
)
LANGUAGE plpgsql AS $$
DECLARE
  stop_threshold DOUBLE PRECISION;
  take_threshold DOUBLE PRECISION;
BEGIN
  -- Calculate thresholds
  stop_threshold := p_entry_price * (1 - p_stop_pct);
  take_threshold := p_entry_price * (1 + p_take_pct);
  
  RETURN QUERY
  WITH candles AS (
    SELECT c.time, c.open, c.high, c.low, c.close
    FROM token_candles_5m c
    WHERE c.token_address = p_token
      AND c.time >= p_entry_time
    ORDER BY c.time ASC
  ),
  hits AS (
    SELECT
      c.time, 
      c.open, 
      c.high, 
      c.low, 
      c.close,
      (c.low <= stop_threshold) AS hit_sl,
      (c.high >= take_threshold) AS hit_tp,
      stop_threshold AS stop_price,
      take_threshold AS take_price
    FROM candles c
  )
  SELECT h.time, h.open, h.high, h.low, h.close, h.hit_sl, h.hit_tp, h.stop_price, h.take_price
  FROM hits h
  WHERE h.hit_sl OR h.hit_tp
  ORDER BY h.time
  LIMIT 1;
END;
$$;

-- Function to analyze multiple SL/TP scenarios for bulk analysis
CREATE OR REPLACE FUNCTION analyze_sl_tp_scenarios(
  p_calls JSONB, -- Array of {token_address, entry_time, entry_price, call_id}
  p_stop_pct DOUBLE PRECISION DEFAULT 0.05,
  p_take_pct DOUBLE PRECISION DEFAULT 0.10,
  p_fee_bps DOUBLE PRECISION DEFAULT 10,
  p_slippage_bps DOUBLE PRECISION DEFAULT 20,
  p_mode TEXT DEFAULT 'conservative'
)
RETURNS TABLE(
  call_id TEXT,
  token_address TEXT,
  entry_time TIMESTAMPTZ,
  entry_price DOUBLE PRECISION,
  hit_found BOOLEAN,
  outcome TEXT, -- 'SL', 'TP', 'NO_HIT'
  hit_time TIMESTAMPTZ,
  exit_price DOUBLE PRECISION,
  roi_pct DOUBLE PRECISION,
  hold_hours DOUBLE PRECISION
)
LANGUAGE plpgsql AS $$
DECLARE
  call_data JSONB;
  hit_result RECORD;
  gross_exit DOUBLE PRECISION;
  net_exit DOUBLE PRECISION;
  fees DOUBLE PRECISION;
BEGIN
  -- Iterate through each call
  FOR call_data IN SELECT jsonb_array_elements(p_calls)
  LOOP
    -- Get SL/TP hit data for this call
    SELECT * INTO hit_result
    FROM sl_tp_first_hit(
      (call_data->>'token_address')::TEXT,
      (call_data->>'entry_time')::TIMESTAMPTZ,
      (call_data->>'entry_price')::DOUBLE PRECISION,
      p_stop_pct,
      p_take_pct
    );
    
    -- Determine outcome and calculate exit price
    IF hit_result IS NULL THEN
      -- No hit found
      RETURN QUERY SELECT
        (call_data->>'call_id')::TEXT,
        (call_data->>'token_address')::TEXT,
        (call_data->>'entry_time')::TIMESTAMPTZ,
        (call_data->>'entry_price')::DOUBLE PRECISION,
        FALSE,
        'NO_HIT'::TEXT,
        NULL::TIMESTAMPTZ,
        NULL::DOUBLE PRECISION,
        NULL::DOUBLE PRECISION,
        NULL::DOUBLE PRECISION;
    ELSE
      DECLARE
        final_outcome TEXT;
        entry_price_val DOUBLE PRECISION := (call_data->>'entry_price')::DOUBLE PRECISION;
        entry_time_val TIMESTAMPTZ := (call_data->>'entry_time')::TIMESTAMPTZ;
      BEGIN
        -- Determine outcome based on mode
        IF hit_result.hit_sl AND hit_result.hit_tp THEN
          -- Both hit in same candle - use mode to decide
          final_outcome := CASE 
            WHEN p_mode = 'optimistic' THEN 'TP'
            ELSE 'SL'
          END;
        ELSE
          -- Only one hit
          final_outcome := CASE 
            WHEN hit_result.hit_tp THEN 'TP'
            ELSE 'SL'
          END;
        END IF;
        
        -- Calculate exit price with fees and slippage
        IF final_outcome = 'TP' THEN
          gross_exit := hit_result.take_price;
        ELSE
          gross_exit := hit_result.stop_price;
        END IF;
        
        -- Apply slippage and fees
        -- Slippage affects the gross exit price
        gross_exit := gross_exit * (1 - p_slippage_bps / 10000.0);
        
        -- Calculate total fees (entry + exit)
        fees := (entry_price_val * p_fee_bps / 10000.0) + (gross_exit * p_fee_bps / 10000.0);
        
        -- Net exit after fees
        net_exit := gross_exit - fees;
        
        RETURN QUERY SELECT
          (call_data->>'call_id')::TEXT,
          (call_data->>'token_address')::TEXT,
          entry_time_val,
          entry_price_val,
          TRUE,
          final_outcome,
          hit_result.time,
          net_exit,
          ((net_exit - entry_price_val) / entry_price_val)::DOUBLE PRECISION,
          EXTRACT(EPOCH FROM (hit_result.time - entry_time_val)) / 3600.0;
      END;
    END IF;
  END LOOP;
END;
$$;

-- Function to get summary statistics for SL/TP scenarios
CREATE OR REPLACE FUNCTION sl_tp_summary_stats(
  p_call_ids TEXT[],
  p_stop_pct DOUBLE PRECISION DEFAULT 0.05,
  p_take_pct DOUBLE PRECISION DEFAULT 0.10,
  p_fee_bps DOUBLE PRECISION DEFAULT 10,
  p_slippage_bps DOUBLE PRECISION DEFAULT 20,
  p_mode TEXT DEFAULT 'conservative'
)
RETURNS TABLE(
  total_calls INTEGER,
  tp_hits INTEGER,
  sl_hits INTEGER,
  no_hits INTEGER,
  win_rate DOUBLE PRECISION,
  avg_roi_pct DOUBLE PRECISION,
  avg_hold_hours DOUBLE PRECISION,
  total_roi_pct DOUBLE PRECISION
)
LANGUAGE plpgsql AS $$
DECLARE
  calls_json JSONB;
BEGIN
  -- Build JSONB array from call IDs
  SELECT jsonb_agg(
    jsonb_build_object(
      'call_id', c.id,
      'token_address', c.contract_address,
      'entry_time', COALESCE(c.message_timestamp, c.created_at),
      'entry_price', COALESCE(c.market_cap, 1000000) / 1000000.0 -- Convert to price-like number
    )
  ) INTO calls_json
  FROM calls c
  WHERE c.id = ANY(p_call_ids)
    AND c.contract_address IS NOT NULL;
  
  -- Get scenario results
  RETURN QUERY
  WITH scenario_results AS (
    SELECT *
    FROM analyze_sl_tp_scenarios(
      calls_json,
      p_stop_pct,
      p_take_pct,
      p_fee_bps,
      p_slippage_bps,
      p_mode
    )
  )
  SELECT
    COUNT(*)::INTEGER as total_calls,
    COUNT(CASE WHEN outcome = 'TP' THEN 1 END)::INTEGER as tp_hits,
    COUNT(CASE WHEN outcome = 'SL' THEN 1 END)::INTEGER as sl_hits,
    COUNT(CASE WHEN outcome = 'NO_HIT' THEN 1 END)::INTEGER as no_hits,
    (COUNT(CASE WHEN outcome = 'TP' THEN 1 END)::DOUBLE PRECISION / 
     NULLIF(COUNT(CASE WHEN outcome IN ('TP', 'SL') THEN 1 END), 0)) as win_rate,
    AVG(CASE WHEN roi_pct IS NOT NULL THEN roi_pct END) as avg_roi_pct,
    AVG(CASE WHEN hold_hours IS NOT NULL THEN hold_hours END) as avg_hold_hours,
    SUM(CASE WHEN roi_pct IS NOT NULL THEN roi_pct ELSE 0 END) as total_roi_pct
  FROM scenario_results;
END;
$$;

-- Helper function to validate candle data completeness
CREATE OR REPLACE FUNCTION check_candle_coverage(
  p_token_address TEXT,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE(
  expected_candles INTEGER,
  actual_candles INTEGER,
  coverage_pct DOUBLE PRECISION,
  first_candle TIMESTAMPTZ,
  last_candle TIMESTAMPTZ
)
LANGUAGE plpgsql AS $$
DECLARE
  expected_count INTEGER;
  actual_count INTEGER;
BEGIN
  -- Calculate expected 5-minute candles
  expected_count := CEIL(EXTRACT(EPOCH FROM (p_end_time - p_start_time)) / 300)::INTEGER;
  
  -- Get actual candle count
  SELECT COUNT(*)::INTEGER INTO actual_count
  FROM token_candles_5m
  WHERE token_address = p_token_address
    AND time BETWEEN p_start_time AND p_end_time;
  
  RETURN QUERY
  SELECT
    expected_count,
    actual_count,
    (actual_count::DOUBLE PRECISION / NULLIF(expected_count, 0) * 100.0) as coverage_pct,
    (SELECT MIN(time) FROM token_candles_5m 
     WHERE token_address = p_token_address AND time >= p_start_time) as first_candle,
    (SELECT MAX(time) FROM token_candles_5m 
     WHERE token_address = p_token_address AND time <= p_end_time) as last_candle;
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION sl_tp_first_hit(TEXT, TIMESTAMPTZ, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated;
GRANT EXECUTE ON FUNCTION analyze_sl_tp_scenarios(JSONB, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION sl_tp_summary_stats(TEXT[], DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_candle_coverage(TEXT, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;

-- Add function comments
COMMENT ON FUNCTION sl_tp_first_hit IS 'Find the first 5-minute candle where stop loss or take profit is triggered';
COMMENT ON FUNCTION analyze_sl_tp_scenarios IS 'Bulk analyze SL/TP scenarios for multiple calls with fee/slippage calculations';
COMMENT ON FUNCTION sl_tp_summary_stats IS 'Generate summary statistics for SL/TP scenario analysis';
COMMENT ON FUNCTION check_candle_coverage IS 'Check data completeness for a token over a time period';