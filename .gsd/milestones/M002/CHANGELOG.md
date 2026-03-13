# Changelog — M002: App Foundation

## [M002] - In Progress

### [S01: Project Scaffold] - 2026-03-12
#### Added
- Expo SDK 55 + all production dependencies (Supabase, NativeWind, Reanimated, fonts)
- All 8 critical landmines neutralized in code (metro, AsyncStorage, URL polyfill, EAS, nav bar)
- Expo Router v3 navigation: 4-tab bar (Hari Ini/Jurnal/Wawasan/Profil) + onboarding stack + auth route
- NativeWind v4 design token pipeline (brand-primary #D4724A terracotta, brand-secondary #4A7D8C teal)
- Button (3 variants × 3 sizes), Card, SafeScreen UI components
- EAS Build configuration for dev/preview/production

### [S02: Onboarding Flow] - 2026-03-13
#### Added
- `src/store/onboarding.ts` — Zustand store with AsyncStorage persistence; goal/frequency/timePreference/isComplete
- `src/store/auth.ts` — Zustand auth store; session/loading/isAuthenticated
- `src/hooks/useAuth.ts` — Supabase session hook; getSession + onAuthStateChange subscription
- 7-screen onboarding flow in Bahasa Indonesia: Value Prop, Goal, Frequency, Time Preference, Plan Preview, AI Taste, Paywall
- Root `_layout.tsx` updated with 3-way auth guard (no onboarding → /onboarding, no session → /auth/login, session → tabs)
- `src/components/ui/ProgressDots.tsx` — 7-dot progress indicator
- `src/components/ui/PricingCard.tsx` — reusable pricing card with badge (IDR pricing: Rp 299.000/tahun, Rp 39.000/bulan)
- `jest.config.js` — stable Jest config for Expo SDK 55 (winter mock, android platform default)
- 24 tests: 5 test files, all passing

### [S03: Authentication] - Planned
