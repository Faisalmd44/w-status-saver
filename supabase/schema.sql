-- Supabase Database Schema for LuxeSave / W Status Saver Metadata
-- IMPORTANT: Actual media files (images & videos) are stored locally on the user's device.
-- Supabase stores ONLY status metadata, user preferences, and sync state.

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 3. Status Metadata Table
-- Stores metadata references for WhatsApp statuses without uploading actual binary media.
CREATE TABLE IF NOT EXISTS public.status_metadata (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  sender_name TEXT NOT NULL,
  time_label TEXT,
  duration TEXT,
  local_file_uri TEXT NOT NULL,
  file_size_bytes BIGINT DEFAULT 0,
  is_saved BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_status_metadata_user_id ON public.status_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_status_metadata_media_type ON public.status_metadata(media_type);
CREATE INDEX IF NOT EXISTS idx_status_metadata_saved ON public.status_metadata(is_saved);
CREATE INDEX IF NOT EXISTS idx_status_metadata_favorite ON public.status_metadata(is_favorite);

-- Enable RLS on Status Metadata
ALTER TABLE public.status_metadata ENABLE ROW LEVEL SECURITY;

-- Status Metadata RLS Policies (Supports both authenticated users and anonymous session tokens)
CREATE POLICY "Users can view own status metadata" 
  ON public.status_metadata FOR SELECT 
  USING (user_id = auth.uid() OR user_id IS NULL OR auth.role() = 'anon');

CREATE POLICY "Users can insert own status metadata" 
  ON public.status_metadata FOR INSERT 
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL OR auth.role() = 'anon');

CREATE POLICY "Users can update own status metadata" 
  ON public.status_metadata FOR UPDATE 
  USING (user_id = auth.uid() OR user_id IS NULL OR auth.role() = 'anon');

CREATE POLICY "Users can delete own status metadata" 
  ON public.status_metadata FOR DELETE 
  USING (user_id = auth.uid() OR user_id IS NULL OR auth.role() = 'anon');

-- Trigger to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_status_metadata_updated_at
BEFORE UPDATE ON public.status_metadata
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
