# T01 Summary: Supabase Project Setup + Profiles Table + RLS
Completed: 2026-03-14
Status: PARTIAL — agent artifacts done, Supabase dashboard setup pending

## What Was Built
SQL migration file for the `profiles` table (8 columns, RLS, auth.users foreign key, performance index).
Supabase client contract tests (7 tests, all passing). `.env.example` updated to include both Supabase vars.
All code-side artifacts are ready; the Supabase dashboard steps require human action.

## Agent-Completed Artifacts
- [x] `supabase/migrations/001_profiles.sql` — table + RLS + index (ready to run in Supabase SQL editor)
- [x] `.env.example` — EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY present
- [x] `.gitignore` — .env already excluded ✓
- [x] `src/lib/supabase.ts` — reads from EXPO_PUBLIC_* env vars (with placeholder fallback) ✓
- [x] `tests/lib/supabase.test.ts` — 7 tests verifying supabase client contract (all passing)

## Pending Human Actions (BEFORE T02 can start)
1. **Create Supabase project** at supabase.com → Singapore region (ap-southeast-1)
2. **Copy credentials** to `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. **Enable Google OAuth**: Supabase Dashboard → Authentication → Providers → Google → Enable
4. **Google Cloud Console**: create OAuth 2.0 client ID → paste into Supabase → add redirect URL:
   `https://<project-ref>.supabase.co/auth/v1/callback`
5. **Run SQL migration**: Supabase Dashboard → SQL Editor → paste `supabase/migrations/001_profiles.sql` → Run
6. **Verify**: profiles table visible in Table Editor, RLS badge shows "enabled"

## Key Decisions Made
- Used `(SELECT auth.uid())` in RLS policy (not `auth.uid()`) for PostgreSQL performance
- `ON DELETE CASCADE` on auth.users FK — GDPR/PDP compliance: delete user = delete profile
- Fallback placeholder URL in supabase.ts so app doesn't crash before `.env` is set up

## Patterns Established
- **SQL via SQL Editor, not Table Editor**: auth.users FK requires raw SQL — Table Editor can't set it up correctly
- **RLS on every table** (Landmine 4): `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` is non-negotiable

## Must-Haves Verification
- [x] `supabase/migrations/001_profiles.sql` — exists, correct 8-column schema ✓
- [x] `.env.example` — both EXPO_PUBLIC_ keys present ✓
- [x] `.gitignore` — `.env` excluded ✓
- [x] `src/lib/supabase.ts` — reads from env vars ✓
- [ ] `profiles` table in Supabase — **PENDING human action**
- [ ] RLS enabled on profiles — **PENDING human action**
- [ ] Google OAuth enabled in Supabase — **PENDING human action**
- [ ] `.env` with real credentials — **PENDING human action**

## What T02 Needs
- `.env` must have real Supabase credentials (app crashes with placeholder on OAuth flow)
- Supabase Google OAuth must be enabled before the login screen can open OAuth sheet
- `profiles` table must exist for post-auth profile creation in T02
