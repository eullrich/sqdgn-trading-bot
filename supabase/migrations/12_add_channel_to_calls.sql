-- Add channel column to calls table to track which Telegram channel the call came from
ALTER TABLE calls
ADD COLUMN channel TEXT;

-- Add an index for efficient filtering by channel
CREATE INDEX idx_calls_channel ON calls(channel);

-- Update existing records to set SQDGN as the default channel
-- (since all existing calls came from SQDGN)
UPDATE calls
SET channel = 'SQDGN_Solana_Direct'
WHERE channel IS NULL;

-- Set the channel column to NOT NULL with a default value
ALTER TABLE calls
ALTER COLUMN channel SET DEFAULT 'SQDGN_Solana_Direct',
ALTER COLUMN channel SET NOT NULL;