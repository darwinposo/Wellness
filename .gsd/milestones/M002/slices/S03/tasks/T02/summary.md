# T02 Summary: Google OAuth Login Screen
Completed: 2026-03-14
Status: VERIFIED (unit tests pass; device test requires Supabase + Google OAuth configured)

## What Was Built
Full login screen (`src/app/auth/login.tsx`) replacing the dev stub, with Google OAuth button
wired to `signInWithGoogle()` from `src/lib/auth.ts`. The auth helper handles the full
expo-web-browser OAuth flow + code exchange + profile creation on first login.

## Files Created/Modified
- `src/app/auth/login.tsx` — full login screen (~110 lines), Google button, Indonesian copy
- `src/lib/auth.ts` — `signInWithGoogle()` + `ensureProfile()` functions (~65 lines)
- `tests/lib/auth.test.ts` — 7 tests: OAuth flow, cancel, error, ensureProfile idempotency

## Key Decisions Made
- **No manual navigation in login.tsx**: navigation to /(tabs) is handled by `onAuthStateChange` in `_layout.tsx` — login screen only needs to call `signInWithGoogle()` and handle errors
- **`skipBrowserRedirect: true`**: tells Supabase to not redirect — we handle browser ourselves via expo-web-browser (required for in-app OAuth on Android)
- **Indonesian error messages**: network errors vs generic failures get different messages
- **`loading` state**: button disabled during auth flow (prevents double-tap)

## Must-Haves Verification
- [x] `src/app/auth/login.tsx` ≥60 lines, SafeScreen wrapper ✓
- [x] `src/lib/auth.ts` exports `signInWithGoogle()` ✓
- [x] `signInWithGoogle` calls `supabase.auth.signInWithOAuth({ provider: 'google' })` ✓
- [x] Auth error shows Indonesian toast ✓ (Alert.alert with Bahasa Indonesia message)
- [x] Cancel (type: 'cancel') does NOT call exchangeCodeForSession ✓
- [ ] Tapping button opens Google account picker — **requires device + Supabase configured**
- [ ] Auth success → Today tab — **requires device + auth state change**

## Patterns Established
- **OAuth = expo-web-browser, not Linking**: `WebBrowser.openAuthSessionAsync` is the correct Android pattern for Supabase OAuth
- **ensureProfile is idempotent**: always check before insert — safe to call on every login
- **Auth navigation = _layout.tsx**: screens never navigate after auth — the root layout handles it

## What T03 Needs
- Profile tab needs a sign-out button using `supabase.auth.signOut()`
- `_layout.tsx` auth guard already redirects unauthenticated → login (from S02)
- Test the full cold-start flow: kill app → reopen → land on Today (not login)
