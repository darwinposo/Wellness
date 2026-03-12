# M002: App Foundation
Created: 2026-03-12

## Goal
A working React Native app on Android with authentication, navigation shell, and onboarding — visually matching the M001 Figma designs.

## Demo
After M002, a tester can install the Reflect APK on their Android phone, complete the 7-screen onboarding, create an account with Supabase auth, and land on the Today/Home screen.

## Slices
- S01: Project Scaffold — After this, the developer can run the Reflect app on a physical Android device via EAS development build, see the tab navigation shell, and confirm NativeWind + Skia + Supabase are all wired up without crashes
- S02: Onboarding Flow — After this, the user can tap through all 7 onboarding screens, select their goal/frequency/time, and see the personalized plan preview
- S03: Authentication — After this, the user can sign up with email or Google, have their session persisted across app restarts, and land on the authenticated Today screen

## Must-Haves (Milestone Level)
- [ ] App runs on physical Android device (Redmi or Samsung A-series test target)
- [ ] All 7 critical landmines from research.md are resolved before first commit
- [ ] Supabase RLS enabled on all tables from day 1
- [ ] EAS Build development profile configured and working
- [ ] Design tokens from M001 T03 are applied (NativeWind + global.css)

## Out of Scope
- AI journal feature (M003)
- Mood check-in (M003)
- Push notifications (M004)
- RevenueCat (M004)
