-- Add column for original Telegram message timestamp
ALTER TABLE calls ADD COLUMN IF NOT EXISTS message_timestamp TIMESTAMPTZ;

-- Add index for message timestamp
CREATE INDEX IF NOT EXISTS idx_calls_message_timestamp ON calls(message_timestamp DESC);

-- Create function to set message_timestamp during insert if not provided
CREATE OR REPLACE FUNCTION set_message_timestamp() RETURNS TRIGGER AS $$
BEGIN
    -- If message_timestamp is not provided, use created_at as fallback
    IF NEW.message_timestamp IS NULL THEN
        NEW.message_timestamp = NEW.created_at;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set message_timestamp
DROP TRIGGER IF EXISTS trigger_set_message_timestamp ON calls;
CREATE TRIGGER trigger_set_message_timestamp
    BEFORE INSERT ON calls
    FOR EACH ROW
    EXECUTE FUNCTION set_message_timestamp();

-- Backfill existing records to use created_at for message_timestamp
UPDATE calls 
SET message_timestamp = created_at 
WHERE message_timestamp IS NULL;

-- Update the calls_with_performance view to include message_timestamp
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