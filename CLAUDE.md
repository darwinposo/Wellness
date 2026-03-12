# Reflect — GSD Context

## Current Position
- Phase: TASK → M001 / S01 / T01
- Milestone: M001 — Design System & Figma Prototype
- Slice: S01 — Design Foundation
- Task: T01 — Color System + Typography in Figma Variables
- Last active: 2026-03-12

## What We're Building
**Reflect** — AI-powered journaling + mood tracking app for Indonesia.
The Calm/Headspace of Southeast Asia, built for Indonesian users first.
Hero: AI companion (Claude Haiku 4.5) journals with you in warm, casual Bahasa Indonesia.

## Locked Decisions
- **Platform**: React Native + Expo SDK 53, Android-first, EAS Build from day 1
- **Design**: Figma-first — Plus Jakarta Sans, terracotta/amber palette, 24px outer padding
- **AI**: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`), sliding window memory, prompt caching
- **Backend**: Supabase Singapore region — `unstable_enablePackageExports: false` required
- **Monetization**: Freemium → Rp 39.000/month via RevenueCat (free until $2,500 MTR)

## Current Task Goal
**T01**: Set up the complete Reflect color palette and typography system in Figma using Variables (not Styles), with light/dark mode support and the exact palette from research specs.

See full task: `.gsd/milestones/M001/slices/S01/tasks/T01/task.md`

## MVP Roadmap
```
M001 — Design System & Figma Prototype  ← YOU ARE HERE
  S01: Design Foundation (tokens, components, export pipeline)
  S02: Core Screens (onboarding, home, mood check-in, journal)
  S03: Supporting Screens + Prototype (all screens wired up)

M002 — App Foundation
  S01: Project Scaffold (Expo SDK 53, deps, EAS, navigation shell)
  S02: Onboarding Flow (7 screens coded)
  S03: Authentication (Supabase email + Google)

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

## Critical Landmines (M002 onwards — do not skip)
1. `metro.config.js`: `unstable_enablePackageExports: false` (Supabase SDK 53 crash)
2. Supabase auth: AsyncStorage adapter only (SecureStore 2048-byte hard limit)
3. First import: `import 'react-native-url-polyfill/auto'`
4. RLS: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` on every table
5. Expo Go: no push notifications Android SDK 53+ → EAS dev build required
6. Lottie: `.json` format only (`.lottie` Android SDK 53 rendering bug)
7. NativeWind: `inlineNativeRem: 16` in metro.config.js

## Key Files
- `.gsd/context.md` — 9 locked decisions
- `.gsd/milestones/M001/milestone.md` — M001 scope
- `.gsd/milestones/M001/slices/S01/tasks/T01/task.md` — current task
- `.gsd/milestones/M001/slices/S01/research.md` — full stack + design research
- `docs/architecture/M001-design.md` — screen inventory + architecture
