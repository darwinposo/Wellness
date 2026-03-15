# T03 Summary: Session Persistence + Sign Out + Protected Routes
Completed: 2026-03-14
Status: VERIFIED (unit tests pass; device verification pending — requires Supabase configured)

## What Was Built
`signOut()` function added to `src/lib/auth.ts`. Profile tab updated with a sign-out button
that calls `signOut()` and relies on `_layout.tsx` to redirect to login via `onAuthStateChange`.
Auth guard in `_layout.tsx` already complete from S02 — verified it covers all routes correctly.

## Files Modified/Created
- `src/lib/auth.ts` — added `signOut()` export (~10 lines added)
- `src/app/(tabs)/profile.tsx` — full profile screen with sign-out button, user email display
- `tests/lib/auth-signout.test.ts` — 3 tests: success, throws on error

## Key Decisions Made
- **signOut() is thin**: just calls `supabase.auth.signOut()` — the `onAuthStateChange` listener in `_layout.tsx` handles the redirect. No direct navigation in Profile screen.
- **Profile shows user email**: `session?.user?.email` from `useAuthStore` — immediate feedback of who's logged in
- **Auth guard already in place**: `_layout.tsx` from S02 handles unauthenticated tabs → login redirect

## Must-Haves Verification
- [x] `src/app/(tabs)/profile.tsx` has sign-out button ✓
- [x] `src/lib/auth.ts` exports `signOut()` ✓
- [x] `signOut()` calls `supabase.auth.signOut()` ✓
- [x] `_layout.tsx` auth guard: `isComplete && !session && !inAuth → /auth/login` ✓
- [x] `useAuth()` calls `getSession()` on mount → session restored from AsyncStorage ✓
- [ ] Kill app → reopen → Today tab — **device verification pending**
- [ ] Sign out → login screen — **device verification pending**

## Session Persistence Explanation
- `supabase.ts` configured with `persistSession: true` + `storage: AsyncStorage`
- On every app start, `useAuth` hook calls `supabase.auth.getSession()` which reads from AsyncStorage
- `_layout.tsx` shows spinner during this check (`authLoading` state) to prevent flicker
- AsyncStorage key: `sb-<project-ref>-auth-token` (auto-managed by Supabase client)

## What Downstream Work Should Know
- S03 is complete from code perspective — Supabase dashboard setup (T01) needed before device test
- After Supabase configured: build EAS dev build for OAuth testing (not Expo Go — Landmine 5)
- RevenueCat paywall integration deferred to M004/S01
