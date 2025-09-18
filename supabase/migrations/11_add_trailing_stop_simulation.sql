-- Trailing Stop Loss Simulation Functions
-- Simulate realistic exits using historical price data with configurable filters

-- Function to simulate trailing stop loss for a single call
CREATE OR REPLACE FUNCTION simulate_trailing_stop_loss(
  p_token_address TEXT,
  p_entry_time TIMESTAMPTZ,
  p_entry_price DOUBLE PRECISION,
  p_trailing_stop_pct DOUBLE PRECISION DEFAULT 0.15,
  p_take_profit_mult DOUBLE PRECISION DEFAULT NULL,
  p_max_hold_days INTEGER DEFAULT NULL,
  p_slippage_bps DOUBLE PRECISION DEFAULT 20,
  p_fee_bps DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE(
  peak_price DOUBLE PRECISION,
  peak_time TIMESTAMPTZ,
  exit_price DOUBLE PRECISION,
  exit_time TIMESTAMPTZ,
  exit_reason TEXT,
  simulated_roi DOUBLE PRECISION,
  days_to_peak DOUBLE PRECISION,
  days_to_exit DOUBLE PRECISION,
  fees_paid DOUBLE PRECISION
)
LANGUAGE plpgsql AS $$
DECLARE
  current_peak DOUBLE PRECISION := p_entry_price;
  current_peak_time TIMESTAMPTZ := p_entry_time;
  trailing_stop_level DOUBLE PRECISION;
  take_profit_level DOUBLE PRECISION;
  max_hold_time TIMESTAMPTZ;
  snapshot_record RECORD;
  exit_price_gross DOUBLE PRECISION;
  exit_price_net DOUBLE PRECISION;
  total_fees DOUBLE PRECISION;
BEGIN
  -- Calculate thresholds
  IF p_take_profit_mult IS NOT NULL THEN
    take_profit_level := p_entry_price * p_take_profit_mult;
  END IF;
  
  IF p_max_hold_days IS NOT NULL THEN
    max_hold_time := p_entry_time + (p_max_hold_days || ' days')::INTERVAL;
  END IF;
  
  -- Iterate through price snapshots after entry
  FOR snapshot_record IN
    SELECT time, price_usd
    FROM token_price_snapshots_5m
    WHERE token_address = p_token_address
      AND time > p_entry_time
      AND price_usd IS NOT NULL
    ORDER BY time ASC
  LOOP
    -- Update peak if we hit a new high
    IF snapshot_record.price_usd > current_peak THEN
      current_peak := snapshot_record.price_usd;
      current_peak_time := snapshot_record.time;
    END IF;
    
    -- Calculate current trailing stop level
    trailing_stop_level := current_peak * (1 - p_trailing_stop_pct);
    
    -- Check exit conditions
    -- 1. Take Profit hit
    IF p_take_profit_mult IS NOT NULL AND snapshot_record.price_usd >= take_profit_level THEN
      exit_price_gross := take_profit_level;
      -- Apply slippage (negative for sells)
      exit_price_gross := exit_price_gross * (1 - p_slippage_bps / 10000.0);
      -- Calculate fees (entry + exit)
      total_fees := (p_entry_price * p_fee_bps / 10000.0) + (exit_price_gross * p_fee_bps / 10000.0);
      exit_price_net := exit_price_gross - total_fees;
      
      RETURN QUERY SELECT
        current_peak,
        current_peak_time,
        exit_price_net,
        snapshot_record.time,
        'TAKE_PROFIT'::TEXT,
        ((exit_price_net - p_entry_price) / p_entry_price * 100)::DOUBLE PRECISION,
        EXTRACT(EPOCH FROM (current_peak_time - p_entry_time)) / 86400.0,
        EXTRACT(EPOCH FROM (snapshot_record.time - p_entry_time)) / 86400.0,
        total_fees;
      RETURN;
    END IF;
    
    -- 2. Trailing Stop hit
    IF snapshot_record.price_usd <= trailing_stop_level THEN
      exit_price_gross := trailing_stop_level;
      -- Apply slippage (negative for sells)
      exit_price_gross := exit_price_gross * (1 - p_slippage_bps / 10000.0);
      -- Calculate fees (entry + exit)
      total_fees := (p_entry_price * p_fee_bps / 10000.0) + (exit_price_gross * p_fee_bps / 10000.0);
      exit_price_net := exit_price_gross - total_fees;
      
      RETURN QUERY SELECT
        current_peak,
        current_peak_time,
        exit_price_net,
        snapshot_record.time,
        'TRAILING_STOP'::TEXT,
        ((exit_price_net - p_entry_price) / p_entry_price * 100)::DOUBLE PRECISION,
        EXTRACT(EPOCH FROM (current_peak_time - p_entry_time)) / 86400.0,
        EXTRACT(EPOCH FROM (snapshot_record.time - p_entry_time)) / 86400.0,
        total_fees;
      RETURN;
    END IF;
    
    -- 3. Max hold time reached
    IF p_max_hold_days IS NOT NULL AND snapshot_record.time >= max_hold_time THEN
      exit_price_gross := snapshot_record.price_usd;
      -- Apply slippage (negative for sells)
      exit_price_gross := exit_price_gross * (1 - p_slippage_bps / 10000.0);
      -- Calculate fees (entry + exit)
      total_fees := (p_entry_price * p_fee_bps / 10000.0) + (exit_price_gross * p_fee_bps / 10000.0);
      exit_price_net := exit_price_gross - total_fees;
      
      RETURN QUERY SELECT
        current_peak,
        current_peak_time,
        exit_price_net,
        snapshot_record.time,
        'MAX_HOLD'::TEXT,
        ((exit_price_net - p_entry_price) / p_entry_price * 100)::DOUBLE PRECISION,
        EXTRACT(EPOCH FROM (current_peak_time - p_entry_time)) / 86400.0,
        EXTRACT(EPOCH FROM (snapshot_record.time - p_entry_time)) / 86400.0,
        total_fees;
      RETURN;
    END IF;
  END LOOP;
  
  -- No exit condition met - return current state
  RETURN QUERY SELECT
    current_peak,
    current_peak_time,
    NULL::DOUBLE PRECISION,
    NULL::TIMESTAMPTZ,
    'NO_EXIT'::TEXT,
    NULL::DOUBLE PRECISION,
    CASE WHEN current_peak_time > p_entry_time THEN
      EXTRACT(EPOCH FROM (current_peak_time - p_entry_time)) / 86400.0
    ELSE 0
    END,
    NULL::DOUBLE PRECISION,
    NULL::DOUBLE PRECISION;
END;
$$;

-- Function to simulate trailing stop loss for multiple calls with filters
CREATE OR REPLACE FUNCTION simulate_filtered_trailing_stop(
  p_filters JSONB DEFAULT '{}',
  p_trailing_stop_pct DOUBLE PRECISION DEFAULT 0.15,
  p_take_profit_mult DOUBLE PRECISION DEFAULT NULL,
  p_max_hold_days INTEGER DEFAULT NULL,
  p_slippage_bps DOUBLE PRECISION DEFAULT 20,
  p_fee_bps DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE(
  call_id UUID,
  token_address TEXT,
  token_symbol TEXT,
  call_type TEXT,
  sqdgn_label TEXT,
  entry_time TIMESTAMPTZ,
  entry_price DOUBLE PRECISION,
  entry_market_cap DOUBLE PRECISION,
  liquidity DOUBLE PRECISION,
  volume_24h DOUBLE PRECISION,
  peak_price DOUBLE PRECISION,
  peak_time TIMESTAMPTZ,
  exit_price DOUBLE PRECISION,
  exit_time TIMESTAMPTZ,
  exit_reason TEXT,
  simulated_roi DOUBLE PRECISION,
  actual_roi DOUBLE PRECISION,
  current_price DOUBLE PRECISION,
  improvement DOUBLE PRECISION,
  days_to_peak DOUBLE PRECISION,
  days_to_exit DOUBLE PRECISION,
  fees_paid DOUBLE PRECISION
)
LANGUAGE plpgsql AS $$
DECLARE
  call_record RECORD;
  simulation_result RECORD;
  actual_roi_calc DOUBLE PRECISION;
  current_price_val DOUBLE PRECISION;
  
  -- Filter variables
  call_types TEXT[];
  labels TEXT[];
  market_cap_min DOUBLE PRECISION;
  market_cap_max DOUBLE PRECISION;
  liquidity_min DOUBLE PRECISION;
  volume_min DOUBLE PRECISION;
  start_date TIMESTAMPTZ;
  end_date TIMESTAMPTZ;
  include_tokens TEXT[];
  exclude_tokens TEXT[];
BEGIN
  -- Extract filters from JSONB
  IF p_filters ? 'callTypes' THEN
    SELECT array_agg(value::TEXT) INTO call_types
    FROM jsonb_array_elements_text(p_filters->'callTypes');
  END IF;
  
  IF p_filters ? 'labels' THEN
    SELECT array_agg(value::TEXT) INTO labels
    FROM jsonb_array_elements_text(p_filters->'labels');
  END IF;
  
  market_cap_min := COALESCE((p_filters->>'marketCapMin')::DOUBLE PRECISION, 0);
  market_cap_max := COALESCE((p_filters->>'marketCapMax')::DOUBLE PRECISION, 1000000000);
  liquidity_min := COALESCE((p_filters->>'liquidityMin')::DOUBLE PRECISION, 0);
  volume_min := COALESCE((p_filters->>'volumeMin')::DOUBLE PRECISION, 0);
  
  IF p_filters ? 'startDate' THEN
    start_date := (p_filters->>'startDate')::TIMESTAMPTZ;
  ELSE
    start_date := '1900-01-01'::TIMESTAMPTZ;
  END IF;
  
  IF p_filters ? 'endDate' THEN
    end_date := (p_filters->>'endDate')::TIMESTAMPTZ;
  ELSE
    end_date := NOW();
  END IF;
  
  IF p_filters ? 'includeTokens' THEN
    SELECT array_agg(value::TEXT) INTO include_tokens
    FROM jsonb_array_elements_text(p_filters->'includeTokens');
  END IF;
  
  IF p_filters ? 'excludeTokens' THEN
    SELECT array_agg(value::TEXT) INTO exclude_tokens
    FROM jsonb_array_elements_text(p_filters->'excludeTokens');
  END IF;
  
  -- Get filtered calls
  FOR call_record IN
    SELECT 
      c.id,
      c.contract_address,
      c.token_symbol,
      c.call_type,
      c.sqdgn_label,
      COALESCE(c.message_timestamp, c.created_at) as entry_time,
      COALESCE(c.initial_price_usd, c.market_cap / 1000000.0) as entry_price,
      c.market_cap as entry_market_cap,
      c.liquidity_usd,
      c.volume_24h,
      c.current_price_usd,
      c.current_market_cap
    FROM calls_with_performance c
    WHERE c.is_valid = true
      AND c.contract_address IS NOT NULL
      AND COALESCE(c.message_timestamp, c.created_at) BETWEEN start_date AND end_date
      AND c.market_cap >= market_cap_min
      AND c.market_cap <= market_cap_max
      AND COALESCE(c.liquidity_usd, 0) >= liquidity_min
      AND COALESCE(c.volume_24h, 0) >= volume_min
      AND (call_types IS NULL OR c.call_type = ANY(call_types))
      AND (labels IS NULL OR c.sqdgn_label = ANY(labels) OR (c.sqdgn_label IS NULL AND 'NO_LABEL' = ANY(labels)))
      AND (include_tokens IS NULL OR c.contract_address = ANY(include_tokens))
      AND (exclude_tokens IS NULL OR NOT (c.contract_address = ANY(exclude_tokens)))
  LOOP
    -- Run simulation for this call
    SELECT * INTO simulation_result
    FROM simulate_trailing_stop_loss(
      call_record.contract_address,
      call_record.entry_time,
      call_record.entry_price,
      p_trailing_stop_pct,
      p_take_profit_mult,
      p_max_hold_days,
      p_slippage_bps,
      p_fee_bps
    );
    
    -- Calculate actual ROI for comparison
    IF call_record.current_market_cap IS NOT NULL AND call_record.entry_market_cap IS NOT NULL THEN
      actual_roi_calc := ((call_record.current_market_cap - call_record.entry_market_cap) / call_record.entry_market_cap) * 100;
    ELSE
      actual_roi_calc := NULL;
    END IF;
    
    current_price_val := call_record.current_price_usd;
    
    -- Return the result
    RETURN QUERY SELECT
      call_record.id,
      call_record.contract_address,
      call_record.token_symbol,
      call_record.call_type,
      call_record.sqdgn_label,
      call_record.entry_time,
      call_record.entry_price,
      call_record.entry_market_cap,
      call_record.liquidity_usd,
      call_record.volume_24h,
      simulation_result.peak_price,
      simulation_result.peak_time,
      simulation_result.exit_price,
      simulation_result.exit_time,
      simulation_result.exit_reason,
      simulation_result.simulated_roi,
      actual_roi_calc,
      current_price_val,
      CASE 
        WHEN simulation_result.simulated_roi IS NOT NULL AND actual_roi_calc IS NOT NULL THEN
          simulation_result.simulated_roi - actual_roi_calc
        ELSE NULL
      END as improvement,
      simulation_result.days_to_peak,
      simulation_result.days_to_exit,
      simulation_result.fees_paid;
  END LOOP;
END;
$$;

-- Function to calculate summary statistics for trailing stop simulation
CREATE OR REPLACE FUNCTION calculate_trailing_stop_summary(
  p_filters JSONB DEFAULT '{}',
  p_trailing_stop_percentages DOUBLE PRECISION[] DEFAULT ARRAY[0.10, 0.15, 0.20, 0.25],
  p_take_profit_mult DOUBLE PRECISION DEFAULT NULL,
  p_max_hold_days INTEGER DEFAULT NULL,
  p_slippage_bps DOUBLE PRECISION DEFAULT 20,
  p_fee_bps DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE(
  trailing_stop_pct DOUBLE PRECISION,
  total_calls INTEGER,
  simulated_calls INTEGER,
  take_profit_exits INTEGER,
  trailing_stop_exits INTEGER,
  max_hold_exits INTEGER,
  no_exits INTEGER,
  simulated_win_rate DOUBLE PRECISION,
  simulated_median_roi DOUBLE PRECISION,
  simulated_avg_roi DOUBLE PRECISION,
  simulated_profit_factor DOUBLE PRECISION,
  actual_win_rate DOUBLE PRECISION,
  actual_median_roi DOUBLE PRECISION,
  actual_avg_roi DOUBLE PRECISION,
  actual_profit_factor DOUBLE PRECISION,
  avg_days_to_exit DOUBLE PRECISION,
  avg_days_to_peak DOUBLE PRECISION,
  avg_improvement DOUBLE PRECISION,
  total_fees_paid DOUBLE PRECISION
)
LANGUAGE plpgsql AS $$
DECLARE
  stop_pct DOUBLE PRECISION;
  simulation_results RECORD;
BEGIN
  -- Iterate through each trailing stop percentage
  FOREACH stop_pct IN ARRAY p_trailing_stop_percentages
  LOOP
    -- Get simulation results for this trailing stop percentage
    WITH sim_results AS (
      SELECT *
      FROM simulate_filtered_trailing_stop(
        p_filters,
        stop_pct,
        p_take_profit_mult,
        p_max_hold_days,
        p_slippage_bps,
        p_fee_bps
      )
    ),
    calculations AS (
      SELECT
        COUNT(*) as total_calls,
        COUNT(CASE WHEN simulated_roi IS NOT NULL THEN 1 END) as simulated_calls,
        COUNT(CASE WHEN exit_reason = 'TAKE_PROFIT' THEN 1 END) as tp_exits,
        COUNT(CASE WHEN exit_reason = 'TRAILING_STOP' THEN 1 END) as ts_exits,
        COUNT(CASE WHEN exit_reason = 'MAX_HOLD' THEN 1 END) as mh_exits,
        COUNT(CASE WHEN exit_reason = 'NO_EXIT' THEN 1 END) as no_exits,
        
        -- Simulated metrics
        COUNT(CASE WHEN simulated_roi > 0 THEN 1 END)::DOUBLE PRECISION / 
          NULLIF(COUNT(CASE WHEN simulated_roi IS NOT NULL THEN 1 END), 0) * 100 as sim_win_rate,
        
        AVG(simulated_roi) FILTER (WHERE simulated_roi IS NOT NULL) as sim_avg_roi,
        
        -- Calculate median ROI
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY simulated_roi) FILTER (WHERE simulated_roi IS NOT NULL) as sim_median_roi,
        
        -- Calculate profit factor
        SUM(CASE WHEN simulated_roi > 0 THEN simulated_roi ELSE 0 END) /
          NULLIF(ABS(SUM(CASE WHEN simulated_roi < 0 THEN simulated_roi ELSE 0 END)), 0) as sim_profit_factor,
        
        -- Actual metrics for comparison
        COUNT(CASE WHEN actual_roi > 0 THEN 1 END)::DOUBLE PRECISION / 
          NULLIF(COUNT(CASE WHEN actual_roi IS NOT NULL THEN 1 END), 0) * 100 as act_win_rate,
        
        AVG(actual_roi) FILTER (WHERE actual_roi IS NOT NULL) as act_avg_roi,
        
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY actual_roi) FILTER (WHERE actual_roi IS NOT NULL) as act_median_roi,
        
        SUM(CASE WHEN actual_roi > 0 THEN actual_roi ELSE 0 END) /
          NULLIF(ABS(SUM(CASE WHEN actual_roi < 0 THEN actual_roi ELSE 0 END)), 0) as act_profit_factor,
        
        AVG(days_to_exit) FILTER (WHERE days_to_exit IS NOT NULL) as avg_days_exit,
        AVG(days_to_peak) FILTER (WHERE days_to_peak IS NOT NULL) as avg_days_peak,
        AVG(improvement) FILTER (WHERE improvement IS NOT NULL) as avg_improvement,
        SUM(COALESCE(fees_paid, 0)) as total_fees
        
      FROM sim_results
    )
    SELECT * INTO simulation_results FROM calculations;
    
    -- Return the results for this trailing stop percentage
    RETURN QUERY SELECT
      stop_pct,
      simulation_results.total_calls,
      simulation_results.simulated_calls,
      simulation_results.tp_exits,
      simulation_results.ts_exits,
      simulation_results.mh_exits,
      simulation_results.no_exits,
      simulation_results.sim_win_rate,
      simulation_results.sim_median_roi,
      simulation_results.sim_avg_roi,
      simulation_results.sim_profit_factor,
      simulation_results.act_win_rate,
      simulation_results.act_median_roi,
      simulation_results.act_avg_roi,
      simulation_results.act_profit_factor,
      simulation_results.avg_days_exit,
      simulation_results.avg_days_peak,
      simulation_results.avg_improvement,
      simulation_results.total_fees;
  END LOOP;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION simulate_trailing_stop_loss(TEXT, TIMESTAMPTZ, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, INTEGER, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated;
GRANT EXECUTE ON FUNCTION simulate_filtered_trailing_stop(JSONB, DOUBLE PRECISION, DOUBLE PRECISION, INTEGER, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_trailing_stop_summary(JSONB, DOUBLE PRECISION[], DOUBLE PRECISION, INTEGER, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated;

-- Add function comments
COMMENT ON FUNCTION simulate_trailing_stop_loss IS 'Simulate trailing stop loss exit for a single call with configurable parameters';
COMMENT ON FUNCTION simulate_filtered_trailing_stop IS 'Simulate trailing stop loss exits for multiple calls with advanced filtering';
COMMENT ON FUNCTION calculate_trailing_stop_summary IS 'Calculate comprehensive summary statistics for different trailing stop scenarios';