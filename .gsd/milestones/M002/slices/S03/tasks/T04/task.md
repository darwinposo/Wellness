# T04: Auth-First Routing + EAS Env Fix

## Goal
Fix two blockers: (1) auth screen must always appear before onboarding — new users register/login first, THEN get onboarded; (2) Supabase env vars must be bundled into EAS builds so the app can actually connect to Supabase.

## Must-Haves
- [ ] Fresh install: login screen appears first (not onboarding)
- [ ] After login: if onboarding incomplete → go to onboarding, then tabs
- [ ] After login: if onboarding complete → go directly to tabs
- [ ] EAS preview/development builds include EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
- [ ] `_layout.tsx` auth guard updated — auth check comes before onboarding check

## TDD Specs
- `tests/hooks/useAuth.test.ts` — existing tests must still pass
- Routing logic is in _layout.tsx (no unit tests for routing — verified by device UAT)
