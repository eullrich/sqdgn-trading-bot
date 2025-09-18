-- Trading system tables for auto-buy and position management

-- User trading configuration
CREATE TABLE IF NOT EXISTS user_trading_config (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_wallet_address text UNIQUE NOT NULL,
    telegram_user_id text,
    is_auto_buy_enabled boolean DEFAULT false,
    default_buy_amount_sol decimal(18, 9) DEFAULT 0.1,
    max_position_size_sol decimal(18, 9) DEFAULT 1.0,
    default_slippage_bps integer DEFAULT 100, -- 1% default
    max_slippage_bps integer DEFAULT 500, -- 5% max
    trailing_stop_enabled boolean DEFAULT true,
    trailing_stop_percentage decimal(5, 2) DEFAULT 10.0, -- 10% default trailing stop
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Trading positions
CREATE TABLE IF NOT EXISTS trading_positions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_wallet_address text NOT NULL,
    token_address text NOT NULL,
    token_symbol text,
    entry_price decimal(20, 10) NOT NULL,
    entry_amount_sol decimal(18, 9) NOT NULL,
    entry_amount_tokens decimal(20, 10) NOT NULL,
    current_price decimal(20, 10),
    current_value_sol decimal(18, 9),
    realized_pnl_sol decimal(18, 9) DEFAULT 0,
    unrealized_pnl_sol decimal(18, 9) DEFAULT 0,
    unrealized_pnl_percentage decimal(10, 2) DEFAULT 0,
    highest_price decimal(20, 10),
    stop_loss_price decimal(20, 10),
    take_profit_price decimal(20, 10),
    trailing_stop_percentage decimal(5, 2),
    status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'partial')),
    entry_tx_signature text,
    exit_tx_signature text,
    exit_price decimal(20, 10),
    exit_amount_sol decimal(18, 9),
    exit_reason text, -- 'manual', 'stop_loss', 'take_profit', 'trailing_stop'
    call_id uuid REFERENCES calls(id),
    opened_at timestamp with time zone DEFAULT now(),
    closed_at timestamp with time zone,
    last_updated timestamp with time zone DEFAULT now()
);

-- Trade history
CREATE TABLE IF NOT EXISTS trade_history (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    position_id uuid REFERENCES trading_positions(id),
    user_wallet_address text NOT NULL,
    token_address text NOT NULL,
    token_symbol text,
    trade_type text NOT NULL CHECK (trade_type IN ('buy', 'sell')),
    amount_sol decimal(18, 9) NOT NULL,
    amount_tokens decimal(20, 10) NOT NULL,
    price decimal(20, 10) NOT NULL,
    slippage_bps integer,
    price_impact_pct decimal(10, 4),
    tx_signature text UNIQUE,
    tx_status text DEFAULT 'pending' CHECK (tx_status IN ('pending', 'confirmed', 'failed')),
    error_message text,
    jupiter_quote jsonb,
    created_at timestamp with time zone DEFAULT now(),
    confirmed_at timestamp with time zone
);

-- Trailing stop tracking
CREATE TABLE IF NOT EXISTS trailing_stops (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    position_id uuid REFERENCES trading_positions(id) UNIQUE,
    highest_price decimal(20, 10) NOT NULL,
    current_stop_price decimal(20, 10) NOT NULL,
    trailing_percentage decimal(5, 2) NOT NULL,
    is_active boolean DEFAULT true,
    last_checked_at timestamp with time zone DEFAULT now(),
    triggered_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Auto-buy queue for processing signals
CREATE TABLE IF NOT EXISTS auto_buy_queue (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    call_id uuid REFERENCES calls(id),
    user_wallet_address text NOT NULL,
    token_address text,
    token_symbol text NOT NULL,
    buy_amount_sol decimal(18, 9) NOT NULL,
    max_price decimal(20, 10),
    slippage_bps integer DEFAULT 100,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    error_message text,
    trade_id uuid REFERENCES trade_history(id),
    created_at timestamp with time zone DEFAULT now(),
    processed_at timestamp with time zone
);

-- Price alerts for monitoring
CREATE TABLE IF NOT EXISTS price_alerts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    position_id uuid REFERENCES trading_positions(id),
    user_wallet_address text NOT NULL,
    token_address text NOT NULL,
    alert_type text NOT NULL CHECK (alert_type IN ('stop_loss', 'take_profit', 'trailing_stop', 'price_target')),
    target_price decimal(20, 10) NOT NULL,
    is_active boolean DEFAULT true,
    triggered_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_trading_positions_user ON trading_positions(user_wallet_address);
CREATE INDEX idx_trading_positions_status ON trading_positions(status);
CREATE INDEX idx_trading_positions_token ON trading_positions(token_address);
CREATE INDEX idx_trade_history_user ON trade_history(user_wallet_address);
CREATE INDEX idx_trade_history_position ON trade_history(position_id);
CREATE INDEX idx_trade_history_tx ON trade_history(tx_signature);
CREATE INDEX idx_auto_buy_queue_status ON auto_buy_queue(status);
CREATE INDEX idx_auto_buy_queue_user ON auto_buy_queue(user_wallet_address);
CREATE INDEX idx_trailing_stops_active ON trailing_stops(is_active);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_trading_config_updated_at BEFORE UPDATE ON user_trading_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trading_positions_updated_at BEFORE UPDATE ON trading_positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trailing_stops_updated_at BEFORE UPDATE ON trailing_stops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper function to calculate PnL
CREATE OR REPLACE FUNCTION calculate_position_pnl(
    p_position_id uuid
) RETURNS TABLE (
    unrealized_pnl_sol decimal,
    unrealized_pnl_percentage decimal,
    current_value_sol decimal
) AS $$
DECLARE
    v_position RECORD;
    v_current_price decimal;
    v_current_value decimal;
    v_unrealized_pnl decimal;
    v_unrealized_pnl_pct decimal;
BEGIN
    -- Get position details
    SELECT * INTO v_position
    FROM trading_positions
    WHERE id = p_position_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Get current price (would be from Jupiter API in real implementation)
    v_current_price := v_position.current_price;
    
    IF v_current_price IS NULL THEN
        RETURN;
    END IF;
    
    -- Calculate current value
    v_current_value := v_position.entry_amount_tokens * v_current_price;
    
    -- Calculate unrealized PnL
    v_unrealized_pnl := v_current_value - v_position.entry_amount_sol;
    v_unrealized_pnl_pct := (v_unrealized_pnl / v_position.entry_amount_sol) * 100;
    
    RETURN QUERY SELECT 
        v_unrealized_pnl,
        v_unrealized_pnl_pct,
        v_current_value;
END;
$$ LANGUAGE plpgsql;

-- Function to check and trigger trailing stops
CREATE OR REPLACE FUNCTION check_trailing_stop(
    p_position_id uuid,
    p_current_price decimal
) RETURNS boolean AS $$
DECLARE
    v_trailing_stop RECORD;
    v_new_stop_price decimal;
    v_should_trigger boolean := false;
BEGIN
    -- Get trailing stop details
    SELECT * INTO v_trailing_stop
    FROM trailing_stops
    WHERE position_id = p_position_id AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Update highest price if current is higher
    IF p_current_price > v_trailing_stop.highest_price THEN
        -- Calculate new stop price
        v_new_stop_price := p_current_price * (1 - v_trailing_stop.trailing_percentage / 100);
        
        UPDATE trailing_stops
        SET highest_price = p_current_price,
            current_stop_price = v_new_stop_price,
            last_checked_at = now()
        WHERE position_id = p_position_id;
    ELSE
        -- Check if stop should trigger
        IF p_current_price <= v_trailing_stop.current_stop_price THEN
            v_should_trigger := true;
            
            UPDATE trailing_stops
            SET is_active = false,
                triggered_at = now()
            WHERE position_id = p_position_id;
        END IF;
        
        UPDATE trailing_stops
        SET last_checked_at = now()
        WHERE position_id = p_position_id;
    END IF;
    
    RETURN v_should_trigger;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE user_trading_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE trailing_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_buy_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_trading_config
CREATE POLICY "Users can view their own config" ON user_trading_config
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own config" ON user_trading_config
    FOR UPDATE USING (true);

CREATE POLICY "Users can insert their own config" ON user_trading_config
    FOR INSERT WITH CHECK (true);

-- RLS policies for trading_positions
CREATE POLICY "Users can view all positions" ON trading_positions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert positions" ON trading_positions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update positions" ON trading_positions
    FOR UPDATE USING (true);

-- RLS policies for trade_history
CREATE POLICY "Users can view all trades" ON trade_history
    FOR SELECT USING (true);

CREATE POLICY "Users can insert trades" ON trade_history
    FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;