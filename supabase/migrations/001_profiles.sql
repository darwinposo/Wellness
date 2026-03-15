-- supabase/migrations/001_profiles.sql
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- DO NOT use Table Editor — it won't set up auth.users foreign key correctly.

-- ============================================================
-- Profiles table
-- Mirrors onboarding preferences collected in S02.
-- Linked to Supabase auth.users via foreign key + CASCADE delete.
-- ============================================================
CREATE TABLE profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT,
  goal              TEXT,           -- 'stress' | 'sleep' | 'happiness'
  frequency         TEXT,           -- 'daily' | '4-5x' | '2-3x' | 'as-needed'
  time_preference   TEXT,           -- 'morning' | 'midday' | 'afternoon' | 'night'
  is_premium        BOOLEAN DEFAULT FALSE,
  journal_count     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (Landmine 4)
-- EVERY table MUST have RLS enabled. Failure = public data exposure.
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: users can only read/write their own profile row
-- Uses (SELECT auth.uid()) instead of auth.uid() directly for RLS performance
CREATE POLICY "user owns profile"
  ON profiles
  FOR ALL
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- ============================================================
-- Performance index (required when RLS filters by id)
-- ============================================================
CREATE INDEX profiles_id_idx ON profiles(id);
