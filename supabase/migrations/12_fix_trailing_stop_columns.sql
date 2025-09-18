-- Fix missing columns for trailing stop simulation
-- Add missing columns to calls table if they don't exist

-- Add initial_price_usd column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calls' AND column_name = 'initial_price_usd'
    ) THEN
        ALTER TABLE calls ADD COLUMN initial_price_usd DOUBLE PRECISION;
    END IF;
END $$;

-- Add current_price_usd column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calls' AND column_name = 'current_price_usd'
    ) THEN
        ALTER TABLE calls ADD COLUMN current_price_usd DOUBLE PRECISION;
    END IF;
END $$;

-- Add initial_market_cap column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calls' AND column_name = 'initial_market_cap'
    ) THEN
        ALTER TABLE calls ADD COLUMN initial_market_cap DOUBLE PRECISION;
    END IF;
END $$;

-- Add current_market_cap column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calls' AND column_name = 'current_market_cap'
    ) THEN
        ALTER TABLE calls ADD COLUMN current_market_cap DOUBLE PRECISION;
    END IF;
END $$;

-- Add price update timestamps if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calls' AND column_name = 'price_updated_at'
    ) THEN
        ALTER TABLE calls ADD COLUMN price_updated_at TIMESTAMPTZ;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calls' AND column_name = 'market_cap_updated_at'
    ) THEN
        ALTER TABLE calls ADD COLUMN market_cap_updated_at TIMESTAMPTZ;
    END IF;
END $$;

-- Add liquidity_usd column if it doesn't exist (referenced in simulation functions)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'calls' AND column_name = 'liquidity_usd'
    ) THEN
        ALTER TABLE calls ADD COLUMN liquidity_usd DOUBLE PRECISION;
        -- Copy existing liquidity data to new column
        UPDATE calls SET liquidity_usd = liquidity WHERE liquidity IS NOT NULL;
    END IF;
END $$;

-- Recreate the calls_with_performance view to ensure it includes all columns
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

-- Update the trailing stop simulation function to fix column references
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
  
  -- Get filtered calls with proper column references
  FOR call_record IN
    SELECT 
      c.id,
      c.contract_address,
      c.token_symbol,
      c.call_type,
      c.sqdgn_label,
      COALESCE(c.message_timestamp, c.created_at) as entry_time,
      -- Use initial_price_usd if available, otherwise estimate from market_cap
      COALESCE(c.initial_price_usd, NULLIF(c.market_cap / 1000000.0, 0)) as entry_price,
      COALESCE(c.initial_market_cap, c.market_cap) as entry_market_cap,
      COALESCE(c.liquidity_usd, c.liquidity) as liquidity_usd,
      c.volume_24h,
      c.current_price_usd,
      c.current_market_cap
    FROM calls_with_performance c
    WHERE c.is_valid = true
      AND c.contract_address IS NOT NULL
      AND COALESCE(c.message_timestamp, c.created_at) BETWEEN start_date AND end_date
      AND COALESCE(c.market_cap, 0) >= market_cap_min
      AND COALESCE(c.market_cap, 0) <= market_cap_max
      AND COALESCE(c.liquidity_usd, c.liquidity, 0) >= liquidity_min
      AND COALESCE(c.volume_24h, 0) >= volume_min
      AND (call_types IS NULL OR c.call_type = ANY(call_types))
      AND (labels IS NULL OR c.sqdgn_label = ANY(labels) OR (c.sqdgn_label IS NULL AND 'NO_LABEL' = ANY(labels)))
      AND (include_tokens IS NULL OR c.contract_address = ANY(include_tokens))
      AND (exclude_tokens IS NULL OR NOT (c.contract_address = ANY(exclude_tokens)))
      -- Only include calls with a valid entry price
      AND COALESCE(c.initial_price_usd, NULLIF(c.market_cap / 1000000.0, 0)) IS NOT NULL
      AND COALESCE(c.initial_price_usd, NULLIF(c.market_cap / 1000000.0, 0)) > 0
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
    IF call_record.current_market_cap IS NOT NULL AND call_record.entry_market_cap IS NOT NULL AND call_record.entry_market_cap > 0 THEN
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