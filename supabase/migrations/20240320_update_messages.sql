-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Add file attachment columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'messages' 
        AND column_name = 'file_url'
    ) THEN
        ALTER TABLE messages
        ADD COLUMN file_url TEXT,
        ADD COLUMN file_name TEXT,
        ADD COLUMN file_type TEXT,
        ADD COLUMN file_size BIGINT;
    END IF;
END $$;

-- Create index on room column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE indexname = 'idx_messages_room'
    ) THEN
        CREATE INDEX idx_messages_room ON messages(room);
    END IF;
END $$;

-- Add check constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'valid_room'
    ) THEN
        ALTER TABLE messages
        ADD CONSTRAINT valid_room CHECK (room IN ('general', 'aem', 'physics', 'programming', 'coa', 'de'));
    END IF;
END $$;

-- Create a function to clean up old messages (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM messages
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up old messages (optional)
SELECT cron.schedule('0 0 * * *', $$SELECT cleanup_old_messages()$$); 