-- Create messages table
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    room TEXT DEFAULT 'general' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    file_url TEXT,
    file_name TEXT,
    file_type TEXT,
    file_size BIGINT
);

-- Create indexes for better query performance
CREATE INDEX messages_username_idx ON messages(username);
CREATE INDEX messages_room_idx ON messages(room);
CREATE INDEX messages_created_at_idx ON messages(created_at);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Everyone can read messages
CREATE POLICY "Everyone can read messages"
    ON messages
    FOR SELECT
    USING (true);

-- Everyone can insert messages
CREATE POLICY "Everyone can insert messages"
    ON messages
    FOR INSERT
    WITH CHECK (true);

-- Users can only update their own messages
CREATE POLICY "Users can update their own messages"
    ON messages
    FOR UPDATE
    USING (auth.uid()::text = username)
    WITH CHECK (auth.uid()::text = username);

-- Users can only delete their own messages
CREATE POLICY "Users can delete their own messages"
    ON messages
    FOR DELETE
    USING (auth.uid()::text = username);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 