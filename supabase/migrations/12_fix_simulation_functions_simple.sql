-- Fix trailing stop simulation functions to use existing columns only
-- This version works with existing schema without adding new columns

CREATE OR REPLACE FUNCTION simulate_filtered_trailing_stop(
  p_filters JSONB DEFAULT '{}',
  p_trailing_stop_pct DOUBLE PRECISION DEFAULT 0.15,
  p_take_profit_mult DOUBLE PRECISION DEFAULT NULL,
  p_max_hold_days INTEGER DEFAULT NULL,
  p_slippage_bps DOUBLE PRECISION DEFAULT 20,
  p_fee_bps DOUBLE PRECISION DEFAULT 10
)
RETURNS TABLE(
  call_id TEXT,
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
  
  -- Get filtered calls using only existing columns
  FOR call_record IN
    SELECT 
      c.id,
      c.contract_address,
      c.token_symbol,
      c.call_type,
      c.sqdgn_label,
      COALESCE(c.message_timestamp, c.created_at) as entry_time,
      -- Use market_cap estimate for entry price (assuming 1M token supply)
      NULLIF(c.market_cap / 1000000.0, 0) as entry_price,
      c.market_cap as entry_market_cap,
      COALESCE(c.liquidity, 0) as liquidity_val,
      COALESCE(c.volume_24h, 0) as volume_24h_val,
      NULL::DOUBLE PRECISION as current_price_usd, -- Set to NULL since we don't have this column
      c.market_cap as current_market_cap -- Use same as entry for now
    FROM calls_with_performance c
    WHERE c.is_valid = true
      AND c.contract_address IS NOT NULL
      AND COALESCE(c.message_timestamp, c.created_at) BETWEEN start_date AND end_date
      AND COALESCE(c.market_cap, 0) >= market_cap_min
      AND COALESCE(c.market_cap, 0) <= market_cap_max
      AND COALESCE(c.liquidity, 0) >= liquidity_min
      AND COALESCE(c.volume_24h, 0) >= volume_min
      AND (call_types IS NULL OR c.call_type = ANY(call_types))
      AND (labels IS NULL OR c.sqdgn_label = ANY(labels) OR (c.sqdgn_label IS NULL AND 'NO_LABEL' = ANY(labels)))
      AND (include_tokens IS NULL OR c.contract_address = ANY(include_tokens))
      AND (exclude_tokens IS NULL OR NOT (c.contract_address = ANY(exclude_tokens)))
      -- Only include calls with a valid entry price estimate
      AND c.market_cap IS NOT NULL
      AND c.market_cap > 0
  LOOP
    -- Skip if we can't calculate an entry price
    IF call_record.entry_price IS NULL OR call_record.entry_price <= 0 THEN
      CONTINUE;
    END IF;
    
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
    
    -- Calculate actual ROI for comparison (using market cap change as proxy)
    IF call_record.current_market_cap IS NOT NULL AND call_record.entry_market_cap IS NOT NULL AND call_record.entry_market_cap > 0 THEN
      actual_roi_calc := ((call_record.current_market_cap - call_record.entry_market_cap) / call_record.entry_market_cap) * 100;
    ELSE
      actual_roi_calc := 0; -- No change assumed if we don't have current data
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
      call_record.liquidity_val,
      call_record.volume_24h_val,
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

-- Also update the summary function to work with this simplified version
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
  sim_results RECORD;
  roi_values DOUBLE PRECISION[];
  actual_roi_values DOUBLE PRECISION[];
  improvement_values DOUBLE PRECISION[];
  profits DOUBLE PRECISION[];
  losses DOUBLE PRECISION[];
  actual_profits DOUBLE PRECISION[];
  actual_losses DOUBLE PRECISION[];
  median_roi DOUBLE PRECISION;
  actual_median_roi DOUBLE PRECISION;
  avg_improvement DOUBLE PRECISION;
  profit_factor DOUBLE PRECISION;
  actual_profit_factor DOUBLE PRECISION;
  total_profit DOUBLE PRECISION;
  total_loss DOUBLE PRECISION;
  actual_total_profit DOUBLE PRECISION;
  actual_total_loss DOUBLE PRECISION;
BEGIN
  -- Loop through each trailing stop percentage
  FOREACH stop_pct IN ARRAY p_trailing_stop_percentages
  LOOP
    -- Reset arrays
    roi_values := ARRAY[]::DOUBLE PRECISION[];
    actual_roi_values := ARRAY[]::DOUBLE PRECISION[];
    improvement_values := ARRAY[]::DOUBLE PRECISION[];
    
    -- Initialize counters
    DECLARE
      total_calls_count INTEGER := 0;
      simulated_calls_count INTEGER := 0;
      take_profit_count INTEGER := 0;
      trailing_stop_count INTEGER := 0;
      max_hold_count INTEGER := 0;
      no_exit_count INTEGER := 0;
      total_days_to_exit DOUBLE PRECISION := 0;
      total_days_to_peak DOUBLE PRECISION := 0;
      total_fees DOUBLE PRECISION := 0;
    BEGIN
      -- Get simulation results for this stop percentage
      FOR sim_results IN
        SELECT * FROM simulate_filtered_trailing_stop(
          p_filters,
          stop_pct,
          p_take_profit_mult,
          p_max_hold_days,
          p_slippage_bps,
          p_fee_bps
        )
      LOOP
        total_calls_count := total_calls_count + 1;
        
        IF sim_results.simulated_roi IS NOT NULL THEN
          simulated_calls_count := simulated_calls_count + 1;
          roi_values := array_append(roi_values, sim_results.simulated_roi);
          
          -- Count exit reasons
          CASE sim_results.exit_reason
            WHEN 'TAKE_PROFIT' THEN take_profit_count := take_profit_count + 1;
            WHEN 'TRAILING_STOP' THEN trailing_stop_count := trailing_stop_count + 1;
            WHEN 'MAX_HOLD' THEN max_hold_count := max_hold_count + 1;
            ELSE no_exit_count := no_exit_count + 1;
          END CASE;
          
          -- Accumulate metrics
          IF sim_results.days_to_exit IS NOT NULL THEN
            total_days_to_exit := total_days_to_exit + sim_results.days_to_exit;
          END IF;
          
          IF sim_results.days_to_peak IS NOT NULL THEN
            total_days_to_peak := total_days_to_peak + sim_results.days_to_peak;
          END IF;
          
          IF sim_results.fees_paid IS NOT NULL THEN
            total_fees := total_fees + sim_results.fees_paid;
          END IF;
        END IF;
        
        -- Collect actual ROI values
        IF sim_results.actual_roi IS NOT NULL THEN
          actual_roi_values := array_append(actual_roi_values, sim_results.actual_roi);
        END IF;
        
        -- Collect improvement values
        IF sim_results.improvement IS NOT NULL THEN
          improvement_values := array_append(improvement_values, sim_results.improvement);
        END IF;
      END LOOP;
      
      -- Calculate statistics
      IF array_length(roi_values, 1) > 0 THEN
        -- Calculate median ROI
        WITH sorted_rois AS (
          SELECT unnest(roi_values) as roi ORDER BY roi
        )
        SELECT INTO median_roi
          CASE 
            WHEN COUNT(*) % 2 = 1 THEN
              (SELECT roi FROM sorted_rois OFFSET (COUNT(*)/2) LIMIT 1)
            ELSE
              (SELECT AVG(roi) FROM (
                SELECT roi FROM sorted_rois OFFSET (COUNT(*)/2 - 1) LIMIT 2
              ) t)
          END
        FROM sorted_rois;
        
        -- Calculate profit factor
        SELECT array_agg(roi) INTO profits FROM unnest(roi_values) roi WHERE roi > 0;
        SELECT array_agg(ABS(roi)) INTO losses FROM unnest(roi_values) roi WHERE roi < 0;
        
        total_profit := COALESCE((SELECT SUM(p) FROM unnest(profits) p), 0);
        total_loss := COALESCE((SELECT SUM(l) FROM unnest(losses) l), 0);
        
        profit_factor := CASE WHEN total_loss > 0 THEN total_profit / total_loss ELSE 999 END;
      ELSE
        median_roi := 0;
        profit_factor := 0;
      END IF;
      
      -- Calculate actual statistics
      IF array_length(actual_roi_values, 1) > 0 THEN
        WITH sorted_actual_rois AS (
          SELECT unnest(actual_roi_values) as roi ORDER BY roi
        )
        SELECT INTO actual_median_roi
          CASE 
            WHEN COUNT(*) % 2 = 1 THEN
              (SELECT roi FROM sorted_actual_rois OFFSET (COUNT(*)/2) LIMIT 1)
            ELSE
              (SELECT AVG(roi) FROM (
                SELECT roi FROM sorted_actual_rois OFFSET (COUNT(*)/2 - 1) LIMIT 2
              ) t)
          END
        FROM sorted_actual_rois;
        
        SELECT array_agg(roi) INTO actual_profits FROM unnest(actual_roi_values) roi WHERE roi > 0;
        SELECT array_agg(ABS(roi)) INTO actual_losses FROM unnest(actual_roi_values) roi WHERE roi < 0;
        
        actual_total_profit := COALESCE((SELECT SUM(p) FROM unnest(actual_profits) p), 0);
        actual_total_loss := COALESCE((SELECT SUM(l) FROM unnest(actual_losses) l), 0);
        
        actual_profit_factor := CASE WHEN actual_total_loss > 0 THEN actual_total_profit / actual_total_loss ELSE 999 END;
      ELSE
        actual_median_roi := 0;
        actual_profit_factor := 0;
      END IF;
      
      -- Calculate average improvement
      IF array_length(improvement_values, 1) > 0 THEN
        SELECT AVG(imp) INTO avg_improvement FROM unnest(improvement_values) imp;
      ELSE
        avg_improvement := 0;
      END IF;
      
      -- Return the results for this trailing stop percentage
      RETURN QUERY SELECT
        stop_pct,
        total_calls_count,
        simulated_calls_count,
        take_profit_count,
        trailing_stop_count,
        max_hold_count,
        no_exit_count,
        CASE WHEN simulated_calls_count > 0 THEN
          (SELECT COUNT(*) FROM unnest(roi_values) roi WHERE roi > 0)::DOUBLE PRECISION / simulated_calls_count * 100
        ELSE 0 END as simulated_win_rate,
        median_roi,
        CASE WHEN simulated_calls_count > 0 THEN
          (SELECT AVG(roi) FROM unnest(roi_values) roi)
        ELSE 0 END as simulated_avg_roi,
        profit_factor,
        CASE WHEN array_length(actual_roi_values, 1) > 0 THEN
          (SELECT COUNT(*) FROM unnest(actual_roi_values) roi WHERE roi > 0)::DOUBLE PRECISION / array_length(actual_roi_values, 1) * 100
        ELSE 0 END as actual_win_rate,
        actual_median_roi,
        CASE WHEN array_length(actual_roi_values, 1) > 0 THEN
          (SELECT AVG(roi) FROM unnest(actual_roi_values) roi)
        ELSE 0 END as actual_avg_roi,
        actual_profit_factor,
        CASE WHEN simulated_calls_count > 0 THEN total_days_to_exit / simulated_calls_count ELSE 0 END,
        CASE WHEN simulated_calls_count > 0 THEN total_days_to_peak / simulated_calls_count ELSE 0 END,
        avg_improvement,
        total_fees;
    END;
  END LOOP;
END;
$$;