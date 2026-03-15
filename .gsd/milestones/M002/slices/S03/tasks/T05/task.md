# T05: Enhanced Register Form + Email Verification

## Goal
Make the register form production-ready: confirm password field, password strength indicator with alphanumeric+symbol rules, block login for unverified email, show clear "check your email" state after registration.

## Must-Haves
- [ ] Register form has "Konfirmasi kata sandi" field
- [ ] "Daftar" button disabled until: passwords match + strength rules pass
- [ ] Password strength rules shown as visual checklist:
  - Min 8 characters
  - At least 1 letter
  - At least 1 number
  - At least 1 symbol (!@#$%^&* etc.)
  - Each rule shows green check ✓ or grey dot when not met
- [ ] After successful register: show "Cek email kamu" screen (not navigate to tabs)
- [ ] Login with unverified email: show "Verifikasi email kamu dulu. Cek inbox." — not generic error
- [ ] All existing 47 tests still pass
