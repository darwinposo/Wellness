# Reflect — GSD Context

## Current Position
- Phase: RESEARCH → M003 / S01 — Mood Check-in
- Milestone: M003 — Core Wellness Features
- Last active: 2026-03-15
- Branch: main (M002 complete ✓)

## What We're Building
**Reflect** — AI-powered journaling + mood tracking app for Indonesia.
The Calm/Headspace of Southeast Asia, built for Indonesian users first.
Hero: AI companion (Claude Haiku 4.5) journals with you in warm, casual Bahasa Indonesia.

## Locked Decisions
- **Platform**: React Native + Expo SDK 55, Android-first, EAS Build from day 1
- **Design**: Plus Jakarta Sans, terracotta/amber palette (#D4724A), 24px outer padding
- **AI**: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`), sliding window memory, prompt caching
- **Backend**: Supabase Singapore region — `unstable_enablePackageExports: false` required
- **Monetization**: Freemium → Rp 39.000/month via RevenueCat (free until $2,500 MTR)

## M002 Complete — What's Available

### Auth APIs
- `src/lib/auth.ts` — `signInWithGoogle()`, `signUpWithEmail()`, `signInWithEmail()`, `sendPasswordReset()`, `signOut()`, `ensureProfile()`
- `src/lib/auth-utils.ts` — `checkPasswordStrength()`, `mapAuthError()`
- `src/store/auth.ts` — `useAuthStore()` → `{ session, loading, isRecoverySession }`
- `src/lib/supabase.ts` — `supabase` client (PKCE, AsyncStorage, Singapore)

### Database
- `profiles` table: `id` (FK auth.users), `email`, `goal`, `frequency`, `time_preference`, `is_premium`, `created_at`
- RLS enabled — all queries auto-scoped to authenticated user
- User ID: `useAuthStore().session?.user?.id`

## Next Steps
1. `/gsd` → kicks off M003/S01 RESEARCH phase (Mood Check-in)

## Critical Landmines (always check when adding deps)
1. `metro.config.js`: `unstable_enablePackageExports: false` ✓
2. Supabase auth: AsyncStorage adapter only ✓
3. First import: `import 'react-native-url-polyfill/auto'` ✓
4. RLS: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` on every new table
5. **OAuth: EAS dev build required** — Expo Go won't open OAuth sheets on Android
6. Lottie: `.json` format only (`.lottie` crashes Android)
7. NativeWind: `inlineNativeRem: 16` in metro.config.js ✓
8. npm installs: always use `--legacy-peer-deps`
9. **`process.env.EXPO_PUBLIC_*` in Jest**: babel-preset-expo inlines these — mock the module in tests

## Patterns Established
- **SafeScreen**: Every screen uses `<SafeScreen>` — never raw `<View>` at screen level
- **fontFamily via style prop**: NativeWind doesn't map font families
- **Auth navigation = _layout.tsx**: screens call signIn/signOut, root layout handles routing
- **ensureProfile is idempotent**: check before insert — safe to call on every login
- **OAuth = expo-web-browser**: `WebBrowser.openAuthSessionAsync` is the Android OAuth pattern
- **Jest mock supabase module**: never import supabase.ts directly in tests (env var crash)
- **PKCE recovery redirect**: append `?type=recovery` to `redirectTo` in `resetPasswordForEmail`
- **Deferred sign-out**: call `signOut({ scope: 'local' })` inside Alert `onPress`, not before
- **Nested Text for inline links**: `<Text onPress>` inside `<Text>` — no TouchableOpacity in flex rows
- **RLS on every table**: `ALTER TABLE <name> ENABLE ROW LEVEL SECURITY` + SELECT/INSERT/UPDATE policy

## MVP Roadmap
```
M001 — Design System & Figma Prototype  ✓ COMPLETE
M002 — App Foundation                   ✓ COMPLETE (2026-03-15)
  S01: Project Scaffold                 ✓
  S02: Onboarding Flow (7 screens)      ✓
  S03: Authentication (Supabase)        ✓ (100 tests, Google OAuth, email, password reset)

M003 — Core Wellness Features           ← NEXT
  S01: Mood Check-in
  S02: AI Journal Session (Claude Haiku 4.5)
  S03: Journal History + Memory

M004 — Monetization & Launch
  S01: RevenueCat + Paywall
  S02: Push Notifications
  S03: Insights Screen (Skia)
  S04: Google Play Submission
```
