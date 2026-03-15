# Reflect — GSD Context

## Current Position
- Phase: VERIFY — M002 / S03 — Authentication
- Milestone: M002 — App Foundation
- Slice: S03 — Authentication (Supabase) — T01–T05 complete, 100 tests passing
- Last active: 2026-03-15
- Branch: gsd/M002-S03

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

## M002/S03 Code Complete — What Was Built
- `src/app/auth/login.tsx` — full Google OAuth login screen (Indonesian copy)
- `src/lib/auth.ts` — `signInWithGoogle()`, `signOut()`, `ensureProfile()` 
- `src/app/(tabs)/profile.tsx` — profile screen with sign-out button
- `supabase/migrations/001_profiles.sql` — profiles table + RLS + index
- `.env.example` — env var template
- `tests/lib/auth.test.ts`, `auth-signout.test.ts`, `supabase.test.ts` — 17 new tests

## ⚠️ Pending Before Device Test (T01 human steps)
1. Create Supabase project at supabase.com → Singapore region
2. Copy credentials to `.env` (EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY)
3. Enable Google OAuth: Supabase Dashboard → Authentication → Providers → Google
4. Google Cloud Console: create OAuth client → paste into Supabase
5. Run `supabase/migrations/001_profiles.sql` in Supabase SQL Editor
6. Build EAS dev build (OAuth won't work in Expo Go — Landmine 5)

## Next Steps
1. `/gsd verify` — run S03 final verification (100 tests pass; device UAT pending)
2. `/gsd-uat` — generate UAT script for full auth flow
3. Run UAT on device (Google OAuth + email register + password reset)
4. `/gsd uat-pass` — merge to main, cleanup branch, advance to M003

## Critical Landmines (always check when adding deps)
1. `metro.config.js`: `unstable_enablePackageExports: false` ✓
2. Supabase auth: AsyncStorage adapter only ✓
3. First import: `import 'react-native-url-polyfill/auto'` ✓
4. RLS: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` on every table ✓ (profiles done)
5. **OAuth: EAS dev build required** — Expo Go won't open OAuth sheets on Android
6. Lottie: `.json` format only (`.lottie` crashes Android)
7. NativeWind: `inlineNativeRem: 16` in metro.config.js ✓
8. npm installs: always use `--legacy-peer-deps`
9. **`process.env.EXPO_PUBLIC_*` in Jest**: babel-preset-expo inlines these — mock the module in tests

## Patterns Established
- **SafeScreen**: Every screen uses `<SafeScreen>` — never raw `<View>` at screen level
- **fontFamily via style prop**: NativeWind doesn't map font families
- **Auth navigation = _layout.tsx**: screens call `signIn/signOut`, root layout handles navigation
- **ensureProfile is idempotent**: check before insert — safe to call on every login
- **OAuth = expo-web-browser**: `WebBrowser.openAuthSessionAsync` is the Android OAuth pattern
- **Jest mock supabase module**: never import supabase.ts directly in tests (env var issue)
- **PKCE recovery redirect**: append `?type=recovery` to `redirectTo` in `resetPasswordForEmail` — PKCE strips type from server redirect
- **Deferred sign-out**: call `signOut({ scope: 'local' })` inside Alert `onPress`, not before — prevents _layout.tsx from navigating before user sees success
- **Nested Text for toggle links**: `<Text onPress>` inside parent `<Text>` prevents Android edge-clipping vs `TouchableOpacity` in flex row

## Key Files
- `src/lib/auth.ts` — signInWithGoogle, signOut, ensureProfile
- `src/lib/supabase.ts` — Supabase client (AsyncStorage, persistSession)
- `src/app/auth/login.tsx` — Google OAuth login screen
- `src/app/(tabs)/profile.tsx` — profile + sign-out
- `supabase/migrations/001_profiles.sql` — run this in Supabase SQL Editor
- `.env.example` — copy to .env and fill credentials

## MVP Roadmap
```
M001 — Design System & Figma Prototype  ✓ COMPLETE (skipped to code)
M002 — App Foundation
  S01: Project Scaffold                 ✓ COMPLETE
  S02: Onboarding Flow (7 screens)      ✓ COMPLETE
  S03: Authentication (Supabase)        ← VERIFY phase (code done, device UAT pending)

M003 — Core Wellness Features
  S01: Mood Check-in
  S02: AI Journal Session (Claude Haiku 4.5)
  S03: Journal History + Memory

M004 — Monetization & Launch
  S01: RevenueCat + Paywall
  S02: Push Notifications
  S03: Insights Screen (Skia)
  S04: Google Play Submission
```
