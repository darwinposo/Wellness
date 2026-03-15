# T04 Summary: Auth-First Routing + EAS Env Fix
Completed: 2026-03-15
Status: VERIFIED

## What Was Built
`_layout.tsx` now enforces auth-first: unauthenticated users always land on login before onboarding.
`eas.json` has `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` baked into all three build profiles (development, preview, production), so EAS builds connect to Supabase without a `.env` file on the build server.

## Key Decisions Made
- Auth guard order: `!session → login` runs before `!isComplete → onboarding` — auth is always the first gate
- Recovery sessions locked to `/auth/reset-password` via `isRecoverySession` flag in `_layout.tsx`
- Callback screen (`inCallback`) deferred — layout never interferes with in-flight deep link handling

## Files Modified
- `src/app/_layout.tsx` — auth guard + recovery session routing (94 lines)
- `eas.json` — env vars added to all 3 build profiles

## Must-Haves Verification
- [x] Fresh install: login screen appears first ✓
- [x] After login, onboarding incomplete → onboarding → tabs ✓
- [x] After login, onboarding complete → tabs directly ✓
- [x] EAS builds include EXPO_PUBLIC_SUPABASE_URL + ANON_KEY ✓
- [x] `_layout.tsx` auth guard updated — auth before onboarding ✓

## What Downstream Work Should Know
- Recovery sessions (password reset) are gated by `isRecoverySession` in `useAuthStore` — only `callback.tsx` sets this flag
- `_layout.tsx` recovery redirect runs before any other routing logic
