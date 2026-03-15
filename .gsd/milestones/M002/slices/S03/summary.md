# S03 Summary: Authentication (Supabase)
Completed: 2026-03-15
Tasks: T01, T02, T03, T04, T05

## What Was Built
Full production-ready authentication system: Google OAuth via expo-web-browser, email/password
registration with strength validation and email verification, password reset via deep link with
PKCE-aware routing and 10-minute security expiry. Session persists across app kills via AsyncStorage.
Auth-first routing ensures unauthenticated users always see login before onboarding. 7 branded
Supabase email templates in Bahasa Indonesia. 100 tests passing across 13 test suites.

## Demo Sentence Fulfilled
After this slice, the user can sign in with Google or email, have their session persist across app
restarts, reset a forgotten password via a secure email deep link, and sign out from the Profile
tab — with all flows in warm, casual Bahasa Indonesia.

## Boundary Map — Verified Exports

| File | Exports | Consumed By |
|------|---------|-------------|
| `src/lib/auth.ts` | `signInWithGoogle`, `signUpWithEmail`, `signInWithEmail`, `sendPasswordReset`, `signOut`, `ensureProfile` | `login.tsx`, `profile.tsx`, `reset-password.tsx` |
| `src/lib/auth-utils.ts` | `checkPasswordStrength`, `mapAuthError`, `PasswordStrength` | `login.tsx`, `reset-password.tsx`, tests |
| `src/store/auth.ts` | `useAuthStore` (session, loading, isRecoverySession, setRecoverySession) | `_layout.tsx`, `login.tsx`, `callback.tsx`, `reset-password.tsx` |
| `src/hooks/useAuth.ts` | `useAuth()` | `_layout.tsx` |
| `src/lib/supabase.ts` | `supabase` | all auth files |

## Key Decisions Made
- **PKCE recovery redirect**: `sendPasswordReset` appends `?type=recovery` to `redirectTo` — PKCE flow strips `type` from server redirect, so it must be embedded in the base URL
- **Recovery session flag**: `isRecoverySession` in Zustand guards the reset-password screen — direct navigation, shared links, and stolen sessions all blocked
- **Deferred sign-out on password reset success**: `signOut({ scope: 'local' })` called inside Alert `onPress`, not before — prevents `_layout.tsx` from navigating before user sees success alert
- **Nested Text for toggle links**: `<Text onPress>` inside parent `<Text>` instead of `TouchableOpacity` in flex row — eliminates Android right-edge clipping
- **2×2 strength grid**: compact labels ("8+ karakter", "Huruf (a-z)", "Angka (0-9)", "Simbol (!@#)") in 2-column layout — prevents wrapping on narrow screens
- **Auth-first guard order**: `!session → login` runs before `!isComplete → onboarding` in `_layout.tsx`
- **EAS env vars baked in**: `eas.json` holds Supabase credentials for all 3 build profiles

## Files Produced

| File | Purpose | Lines |
|------|---------|-------|
| `src/app/auth/login.tsx` | Login + register screen (unified) | 509 |
| `src/app/auth/callback.tsx` | OAuth + email deep link handler | 170 |
| `src/app/auth/reset-password.tsx` | Secure password reset screen | 281 |
| `src/lib/auth.ts` | Auth functions | 167 |
| `src/lib/auth-utils.ts` | Password validation + error mapping | 52 |
| `src/lib/supabase.ts` | Supabase client (PKCE, AsyncStorage) | 20 |
| `src/store/auth.ts` | Auth Zustand store | 34 |
| `src/hooks/useAuth.ts` | onAuthStateChange subscriber | 34 |
| `src/app/_layout.tsx` | Root auth guard + recovery routing | 94 |
| `supabase/migrations/001_profiles.sql` | Profiles table + RLS | 38 |
| `supabase/email-templates/` | 7 branded HTML templates | — |
| `eas.json` | EAS build config with env vars | 36 |
| `tests/lib/` | 8 test files | 1000+ |

## Patterns Established (downstream should follow)

- **PKCE recovery redirect**: Append `?type=recovery` to `redirectTo` in `resetPasswordForEmail` — PKCE strips the type, it must live in the URL
- **Deferred sign-out**: Call `signOut` inside Alert `onPress`, not before showing it
- **Nested Text for inline tappable links**: Prevents Android edge-clipping vs TouchableOpacity in row
- **Auth navigation = `_layout.tsx` only**: Screens call auth functions; `_layout.tsx` handles all routing
- **ensureProfile is idempotent**: check-before-insert pattern, safe to call on every login
- **Jest mock supabase module**: Never import `supabase.ts` directly in tests (env var crash)
- **OAuth = expo-web-browser**: `WebBrowser.openAuthSessionAsync` is the Android Supabase OAuth pattern

## What M003 Should Know
- Supabase client available at `src/lib/supabase.ts` — import `supabase` directly
- User session available via `useAuthStore()` — `session.user.id` is the authenticated user ID
- `ensureProfile(userId, email)` is idempotent — safe to call anywhere after auth
- `profiles` table has `id`, `email`, `goal`, `frequency`, `time_preference`, `is_premium`, `created_at`
- All API calls to Supabase should use `.eq('user_id', session.user.id)` — RLS is enabled on all tables
- `flowType: 'pkce'` is set on the Supabase client — do not change this (required for Google OAuth)

## Must-Haves: All Verified
- [x] Google OAuth: button → sheet → Today tab ✓ (device tested)
- [x] Email register: form validation + confirm password + strength grid ✓
- [x] Email login: blocks unverified emails with Indonesian message ✓
- [x] Password reset: deep link → `/auth/reset-password` → secure change → login ✓
- [x] Session persists: kill + reopen → still logged in ✓
- [x] Sign out → login screen ✓
- [x] Auth-first routing: login before onboarding on fresh install ✓
- [x] EAS builds include Supabase env vars ✓
- [x] 100/100 tests passing ✓
