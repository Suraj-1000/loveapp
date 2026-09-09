-- Date Invitation Web App Database Schema (Supabase / PostgreSQL)

-- 1. Create table date_invitations
CREATE TABLE IF NOT EXISTS public.date_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invite_code TEXT UNIQUE NOT NULL,
    recipient_name TEXT DEFAULT 'My Love',
    sender_name TEXT DEFAULT 'Suraj',
    response TEXT CHECK (response IN ('YES', 'NO', NULL)),
    selected_date DATE,
    selected_time TIME,
    vibe TEXT,
    preparation_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookup by unique invitation link code
CREATE INDEX IF NOT EXISTS idx_date_invitations_code ON public.date_invitations(invite_code);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.date_invitations ENABLE ROW LEVEL SECURITY;

-- 3. Drop all old policies to prevent "already exists" errors
DROP POLICY IF EXISTS "Public Read Access by Invite Code" ON public.date_invitations;
DROP POLICY IF EXISTS "Public Update Response Access" ON public.date_invitations;
DROP POLICY IF EXISTS "Admin Full Access" ON public.date_invitations;
DROP POLICY IF EXISTS "Public Full Access" ON public.date_invitations;

-- 4. Create one unified RLS Policy for this personal app
CREATE POLICY "Public Full Access" 
ON public.date_invitations 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 5. Seed initial default invitation record for demo
INSERT INTO public.date_invitations (invite_code, recipient_name, sender_name, status)
VALUES ('demo-love-2026', 'My Love', 'Suraj', 'pending')
ON CONFLICT (invite_code) DO NOTHING;
