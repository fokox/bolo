-- Create bolo_profiles table
CREATE TABLE IF NOT EXISTS public.bolo_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    secret_passcode TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.bolo_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read of bolo_profiles
CREATE POLICY "Allow public read on bolo_profiles"
    ON public.bolo_profiles
    FOR SELECT
    USING (true);

-- Allow public insert of bolo_profiles
CREATE POLICY "Allow public insert on bolo_profiles"
    ON public.bolo_profiles
    FOR INSERT
    WITH CHECK (true);

-- Create bolo_messages table
CREATE TABLE IF NOT EXISTS public.bolo_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_username TEXT NOT NULL REFERENCES public.bolo_profiles(username) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.bolo_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous message inserts
CREATE POLICY "Allow anonymous message inserts"
    ON public.bolo_messages
    FOR INSERT
    WITH CHECK (true);

-- Allow reading messages
CREATE POLICY "Allow read bolo_messages"
    ON public.bolo_messages
    FOR SELECT
    USING (true);

-- Allow updating messages (mark as read)
CREATE POLICY "Allow update bolo_messages"
    ON public.bolo_messages
    FOR UPDATE
    USING (true);

-- Allow deleting messages
CREATE POLICY "Allow delete bolo_messages"
    ON public.bolo_messages
    FOR DELETE
    USING (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_bolo_messages_recipient ON public.bolo_messages(recipient_username, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bolo_profiles_username ON public.bolo_profiles(username);
