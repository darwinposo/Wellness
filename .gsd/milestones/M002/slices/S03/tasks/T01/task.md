# T01: Supabase Project Setup + Profiles Table + RLS
Slice: M002/S03
Created: 2026-03-12

## Goal
Set up the Supabase project (Singapore region), create the profiles table with correct schema, enable RLS with user-owns-row policy, configure Google OAuth provider, and wire the env vars into the app.

## Steps
1. Create Supabase project at supabase.com → choose Singapore (ap-southeast-1) region
2. Copy URL + anon key → add to `.env` as `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Enable Google OAuth: Supabase dashboard → Authentication → Providers → Google → enable
4. Get Google OAuth credentials from Google Cloud Console → paste into Supabase
5. Add redirect URL to Google Cloud Console: `https://<project-ref>.supabase.co/auth/v1/callback`
6. Run SQL migration to create `profiles` table
7. Enable RLS on `profiles` table
8. Create RLS policy: user can SELECT/INSERT/UPDATE their own row
9. Create index on `profiles(id)` for RLS performance
10. Verify: table appears in Supabase dashboard, RLS badge shows "enabled"

## Must-Haves

### Truths
- [ ] `profiles` table exists with correct schema (8 columns)
- [ ] RLS is enabled on `profiles` (visible in Supabase dashboard)
- [ ] "user owns rows" policy exists on `profiles`
- [ ] Google OAuth provider enabled in Supabase
- [ ] `.env` file has both Supabase vars set
- [ ] `npx expo start` still works after env vars added

### Artifacts
- [ ] `.env` — EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY present
- [ ] `.env.example` — same keys with placeholder values (safe to commit)
- [ ] `supabase/migrations/001_profiles.sql` — migration file with table + RLS

### Key Links
- [ ] `.gitignore` includes `.env` (never commit secrets)
- [ ] `src/lib/supabase.ts` reads from `process.env.EXPO_PUBLIC_SUPABASE_URL`

## SQL Migration

```sql
-- supabase/migrations/001_profiles.sql

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

-- Enable Row Level Security (Landmine 4 fix)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: users can only access their own profile
CREATE POLICY "user owns profile"
  ON profiles
  FOR ALL
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Index for RLS performance (required)
CREATE INDEX profiles_id_idx ON profiles(id);
```

## Notes
- Supabase free tier is sufficient for MVP (500MB DB, 1GB storage, 2GB bandwidth)
- Singapore region = ap-southeast-1 = lowest latency for Indonesia
- Google Cloud Console: create OAuth 2.0 credentials, add the Supabase callback URL
- `ON DELETE CASCADE` on profiles means deleting the auth.users row deletes the profile — critical for GDPR/PDP compliance
- Do NOT use the Supabase Table Editor for this table — it won't set up the auth.users foreign key correctly. Use SQL editor.
