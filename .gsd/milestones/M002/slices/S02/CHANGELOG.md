# Changelog — S02: Onboarding Flow

## [S02] - 2026-03-13

### Added
- `src/store/onboarding.ts` — Zustand store with AsyncStorage persistence; tracks `goal`, `frequency`, `timePreference`, `isComplete`, and `complete()` action
- `src/store/auth.ts` — Zustand auth store; tracks `session`, `loading`, `isAuthenticated`
- `src/hooks/useAuth.ts` — Supabase session hook; calls `getSession` on mount, subscribes to `onAuthStateChange`
- `src/app/onboarding/index.tsx` — Screen 1: Value Prop with "Mulai Perjalananmu" CTA; BackHandler blocks Android back on first screen
- `src/app/onboarding/goal.tsx` — Screen 2: Goal selection (3 SelectionCards), stores to Zustand
- `src/app/onboarding/frequency.tsx` — Screen 3: Frequency (4 options), stores to Zustand
- `src/app/onboarding/time.tsx` — Screen 4: Time Preference (4 options with emoji), stores to Zustand
- `src/app/onboarding/preview.tsx` — Screen 5: Personalized plan summary, reads goal + frequency from Zustand
- `src/app/onboarding/taste.tsx` — Screen 6: Mock AI chat with local mood picker state + hardcoded warm response
- `src/app/onboarding/paywall.tsx` — Screen 7: IDR pricing tiers (annual pre-selected), calls `complete()` before navigating to /auth/login
- `src/components/ui/ProgressDots.tsx` — 7-dot progress indicator with `current`/`total` props
- `src/components/ui/PricingCard.tsx` — Reusable pricing card with optional badge
- Root `_layout.tsx` updated: 3-way auth guard (`<Redirect>`) — no onboarding → /onboarding, no session → /auth/login, session → `<Slot>` (tabs)
- `jest.config.js` — Expo SDK 55 Jest config: `expo/src/winter` mocked via `moduleNameMapper`, `haste.defaultPlatform: 'android'`
- 24 tests across 5 test files — all passing

### Technical Notes
- Routing decisions centralized in root `_layout.tsx` via Expo Router `<Redirect>` — screens do not self-redirect
- `complete()` must be called before navigating away from paywall to avoid race condition with root layout re-render
- `expo/src/winter` mock is `moduleNameMapper` only — using `setupFiles` causes jest-expo preset crash on Expo SDK 55
- All user-visible copy is Bahasa Indonesia from day 1
