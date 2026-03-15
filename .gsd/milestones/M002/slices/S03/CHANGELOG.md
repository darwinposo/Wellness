# Changelog — S03: Authentication (Supabase)

## [S03] - 2026-03-15

### Added
- `signInWithGoogle()` — Google OAuth via expo-web-browser + PKCE code exchange
- `signUpWithEmail(email, password)` — email registration with fake-success detection
- `signInWithEmail(email, password)` — email login with unverified-email guard
- `sendPasswordReset(email)` — sends Supabase reset email with `?type=recovery` deep link
- `signOut()` — signs out locally + clears session state
- `ensureProfile(userId, email)` — idempotent profile creation after Google OAuth
- `checkPasswordStrength(password)` — 4-rule strength validator (length, letter, number, symbol)
- `mapAuthError(message)` — maps Supabase errors to Bahasa Indonesia user messages
- `useAuth()` hook — onAuthStateChange subscriber, PASSWORD_RECOVERY event handler
- `useAuthStore` — Zustand store with session, loading, isRecoverySession, setRecoverySession
- `/auth/login` — unified login + register screen with 2×2 strength grid, eye icon, forgot password
- `/auth/callback` — OAuth + email verification deep link handler (PKCE + hash-fragment fallback)
- `/auth/reset-password` — secure password reset screen (server-side validation + 10-minute expiry)
- `supabase/migrations/001_profiles.sql` — profiles table with RLS, CASCADE delete, index
- `supabase/email-templates/` — 7 branded HTML email templates in Bahasa Indonesia
- `eas.json` — Supabase env vars baked into all 3 EAS build profiles
- 100 tests across 13 test suites

### Fixed
- [S03-v2] Auth routing: password reset deep link was auto-logging in instead of showing reset screen
  - Root cause: PKCE flow strips `type=recovery` from redirect URL
  - Fix: embed `?type=recovery` in `redirectTo` URL in `sendPasswordReset()`
- [S03-v2] "Masuk" toggle link clipped on right edge — refactored to nested `<Text onPress>`
- [S03-v2] Strength indicators breaking into multiple lines — redesigned as 2×2 compact grid
- [S03-v2] Password reset success redirecting before user saw alert — deferred `signOut` to alert `onPress`
- [S03-v2] "Gabung" button showing as disabled when fields filled — explicit grey background for disabled state

### Technical Notes
- Supabase client uses `flowType: 'pkce'` (required for Google OAuth) + `detectSessionInUrl: false`
- Session persistence: `persistSession: true` + `storage: AsyncStorage` — Supabase key auto-managed
- Recovery sessions: `isRecoverySession` flag in Zustand prevents recovery link from granting full app access
- Email templates: paste HTML into Supabase Dashboard → Authentication → Email Templates (manual step)
