# Reflect — GSD Context

## Current Position
- Phase: PLAN → M002 / S03 — Authentication
- Milestone: M002 — App Foundation
- Slice: S03 — Authentication (Supabase)
- Last active: 2026-03-13

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

## M002/S01 Complete — What Was Built
- Expo SDK 55 scaffold with all deps + all landmines fixed
- 4-tab navigation shell: Hari Ini, Jurnal, Wawasan, Profil (Bahasa Indonesia)
- NativeWind 4.1.23 + Tailwind 3.4.0 design token pipeline live
- Supabase client with AsyncStorage adapter
- Button (3 variants) + Card + SafeScreen UI components
- EAS build config, metro landmine fix, url-polyfill applied
- APK built successfully: `android/app/build/outputs/apk/debug/app-debug.apk`

## Next: M002/S02 — Onboarding Flow
Plan and implement 7 onboarding screens in Bahasa Indonesia:
1. Splash/Welcome
2. Value proposition
3. Mood check-in intro
4. Journal intro
5. AI companion intro
6. Name input
7. Notification permission

## Critical Landmines (always check when adding deps)
1. `metro.config.js`: `unstable_enablePackageExports: false` ✓ DONE
2. Supabase auth: AsyncStorage adapter only ✓ DONE
3. First import: `import 'react-native-url-polyfill/auto'` ✓ DONE
4. RLS: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` on every table (M003)
5. Expo Go: no push notifications Android → EAS dev build required ✓ DONE
6. Lottie: `.json` format only (`.lottie` crashes Android)
7. NativeWind: `inlineNativeRem: 16` in metro.config.js ✓ DONE
8. npm installs: always use `--legacy-peer-deps` (React 19 peer conflicts)

## Patterns Established
- **SafeScreen**: Every screen uses `<SafeScreen>` — never raw `<View>` at screen level
- **fontFamily via style prop**: NativeWind doesn't map font families — use `style={{ fontFamily: FONTS.sans }}`
- **className for tokens, style for platform**: color/spacing/radius in className; font/shadow in style
- **Indonesian copy from day 1**: All user-visible strings in Bahasa Indonesia
- **--legacy-peer-deps**: Required for all npm installs in this project

## Key Files
- `.gsd/context.md` — locked decisions
- `.gsd/milestones/M002/slices/S01/uat.md` — S01 UAT script (run on device)
- `docs/features/M002-S01-project-scaffold.md` — scaffold architecture docs
- `src/lib/constants.ts` — COLORS, SPACING, FONTS tokens
- `src/components/ui/` — Button, Card, SafeScreen components

## MVP Roadmap
```
M001 — Design System & Figma Prototype  ✓ COMPLETE (skipped to code)
M002 — App Foundation
  S01: Project Scaffold                 ✓ COMPLETE
  S02: Onboarding Flow (7 screens)      ← YOU ARE HERE (PLAN)
  S03: Authentication (Supabase)

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
