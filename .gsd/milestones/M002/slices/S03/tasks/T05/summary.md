# T05 Summary: Enhanced Register Form + Password Reset Flow
Completed: 2026-03-15
Status: VERIFIED

## What Was Built
Register form is production-ready: confirm password field, 2×2 strength grid, "Gabung" button disabled until all rules pass + passwords match. Login blocks unverified emails with a clear Indonesian message. Full password reset flow: "Lupa kata sandi?" on login → Supabase email → deep link `reflect://auth/callback?type=recovery&code=xxx` → `/auth/reset-password` screen with security hardening. 7 Supabase email templates with Reflect brand design.

## Key Decisions Made
- `flowType: 'pkce'` strips `type=recovery` from redirect → fixed by embedding `?type=recovery` in `redirectTo` URL in `sendPasswordReset()`
- Password reset screen guards: `isRecoverySession` flag + live `getUser()` server check + 10-minute auto-expiry timer
- Sign-out deferred to alert button `onPress` — prevents `_layout.tsx` redirecting to login before user sees success message
- Strength indicators: 2×2 compact grid (short labels: "8+ karakter", "Huruf (a-z)", "Angka (0-9)", "Simbol (!@#)") — prevents text wrapping on narrow screens
- Toggle link ("Sudah punya akun? Masuk") refactored to single nested `Text` — eliminates edge clipping from `flexWrap: 'nowrap'` + `justifyContent: 'center'` overflow

## Files Modified
- `src/app/auth/login.tsx` — confirm password, strength grid, forgot password, toggle fix (500+ lines)
- `src/app/auth/reset-password.tsx` — created, full reset screen with security guards
- `src/app/auth/callback.tsx` — hash-fragment type parsing, recovery routing
- `src/app/_layout.tsx` — recovery session lock, inResetPassword exclusion
- `src/hooks/useAuth.ts` — PASSWORD_RECOVERY event → setRecoverySession
- `src/lib/auth.ts` — sendPasswordReset with ?type=recovery in redirectTo
- `src/lib/auth-utils.ts` — maxLength rule, email_already_registered sentinel
- `src/store/auth.ts` — isRecoverySession flag + setRecoverySession action
- `supabase/email-templates/` — 7 branded HTML templates with subject lines
- `tests/lib/` — 3 new test files, 100 tests total passing

## Patterns Established
- **PKCE recovery redirect**: Always append `?type=recovery` to `redirectTo` in `resetPasswordForEmail` — PKCE strips type from the server redirect, so it must be in the base URL
- **Deferred sign-out after success**: Call `signOut({ scope: 'local' })` inside Alert `onPress`, not before — prevents `_layout.tsx` from navigating away before the user sees the success message
- **Nested Text for toggle links**: Use `<Text onPress={...}>` inside a parent `<Text>` instead of `TouchableOpacity` in a `flexDirection: 'row'` container — eliminates Android edge-clipping bugs

## Must-Haves Verification
- [x] Register: confirm password field ✓
- [x] Register: Gabung disabled until passwords match + all strength rules pass ✓
- [x] Register: 2×2 strength grid displayed ✓
- [x] Register: success → "Cek email kamu" alert shown ✓
- [x] Login: unverified email → "Verifikasi email kamu dulu" message ✓
- [x] Password reset: email → deep link → /auth/reset-password (not auto-login) ✓
- [x] Password reset: success → alert → "Masuk sekarang" → back to login ✓
- [x] 100/100 tests passing ✓

## What Downstream Work Should Know
- `isRecoverySession` in `useAuthStore` must be false before navigating to any non-reset-password screen after password reset
- Email templates are in `supabase/email-templates/` — manually paste into Supabase Dashboard per template
