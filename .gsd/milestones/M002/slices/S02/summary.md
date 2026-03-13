# S02 Summary: Onboarding Flow
Completed: 2026-03-13
Tasks: T01, T02, T03

## What Was Built
A complete 7-screen onboarding flow in Bahasa Indonesia, backed by a Zustand store with AsyncStorage
persistence, a root-level auth guard that routes users correctly on every launch, and auth state
management wired to Supabase. Users progress through goal/frequency/time preference selection, a
personalized plan preview, a mock AI journal taste, and a paywall — all state persisted across app
restarts. After completing onboarding, the root layout redirects to the main app (once authenticated)
or to login.

## Demo Sentence Fulfilled
After this slice, the user can: open the app for the first time, complete 7 onboarding screens in
Bahasa Indonesia, and land on the login screen — with their preferences saved across restarts.

## Boundary Map — Verified Exports
| File | Exports | Consumed By |
|------|---------|-------------|
| `src/store/onboarding.ts` | `useOnboardingStore`, `OnboardingState` | `_layout.tsx`, all 7 onboarding screens |
| `src/store/auth.ts` | `useAuthStore` | `src/hooks/useAuth.ts`, `src/app/_layout.tsx` |
| `src/hooks/useAuth.ts` | `useAuth` | `src/app/_layout.tsx` |
| `src/components/ui/ProgressDots.tsx` | `ProgressDots` | all 7 onboarding screens |
| `src/components/ui/PricingCard.tsx` | `PricingCard` | `src/app/onboarding/paywall.tsx` |
| `src/components/ui/index.ts` | re-exports all above | consumers |

## Key Decisions Made
- **Separate auth + onboarding stores**: auth and onboarding are independent concerns — `useAuthStore` vs `useOnboardingStore`
- **Expo Router `<Redirect>` in root layout**: idiomatic for Expo Router v3; no custom navigation logic in screens
- **Auth loading spinner**: prevents blank screen flash during cold start session resolution (~100-300ms)
- **`complete()` called in paywall before navigation**: ensures `isComplete=true` before root layout re-renders
- **BackHandler on Screen 1**: blocks Android hardware back from escaping onboarding on first launch
- **taste.tsx local state**: mood selection is ephemeral UI — not persisted to store
- **paywall routes to `/auth/login` immediately**: RevenueCat deferred to M004/S01
- **Jest platform `android` default + `expo/src/winter` mock via `moduleNameMapper`**: only stable Jest/Expo SDK 55 config

## Files Produced
| File | Purpose | Lines |
|------|---------|-------|
| `src/store/onboarding.ts` | Zustand onboarding store — goal/frequency/timePreference/isComplete | ~35 |
| `src/store/auth.ts` | Zustand auth store — session/loading/isAuthenticated | ~26 |
| `src/hooks/useAuth.ts` | Supabase session hook — getSession + onAuthStateChange | ~38 |
| `src/app/_layout.tsx` | Root layout with 3-way auth guard | modified |
| `src/app/onboarding/index.tsx` | Screen 1 — Value Prop + BackHandler | ~60 |
| `src/app/onboarding/goal.tsx` | Screen 2 — Goal selection (3 cards) | ~110 |
| `src/app/onboarding/frequency.tsx` | Screen 3 — Frequency (4 options) | ~110 |
| `src/app/onboarding/time.tsx` | Screen 4 — Time Preference (4 options + emoji) | ~110 |
| `src/app/onboarding/preview.tsx` | Screen 5 — Plan preview reading Zustand store | ~114 |
| `src/app/onboarding/taste.tsx` | Screen 6 — Mock AI chat with mood picker | ~138 |
| `src/app/onboarding/paywall.tsx` | Screen 7 — IDR pricing tiers + dual CTAs | ~84 |
| `src/components/ui/ProgressDots.tsx` | 7-dot progress indicator | ~40 |
| `src/components/ui/PricingCard.tsx` | Reusable pricing card with badge | ~62 |
| `src/app/onboarding/_layout.tsx` | Onboarding Stack layout | ~10 |
| `jest.config.js` | Jest config for Expo SDK 55 — android platform, winter mock | ~30 |
| `tests/store/onboarding.test.ts` | 7 onboarding store tests | all ✓ |
| `tests/store/auth.test.ts` | 5 auth store tests | all ✓ |
| `tests/components/ProgressDots.test.tsx` | 3 component tests | all ✓ |
| `tests/components/PricingCard.test.tsx` | 4 component tests | all ✓ |
| `tests/hooks/useAuth.test.ts` | 5 hook tests | all ✓ |

## Patterns Established (downstream should follow)
- **SelectionCard**: `TouchableOpacity` with `borderWidth: 2`, `borderColor: brandPrimary when selected`, `SHADOWS.card when not selected`. Used in goal/time/frequency — reuse this pattern in M003 mood check-in.
- **ScreenLayout**: `flex-1 justify-between px-6 py-8` with `flex-1` content area and fixed bottom `gap-6` containing ProgressDots + Button.
- **Disabled CTA**: Pass `disabled={!selectedValue}` to Button — opacity handled internally.
- **Zustand + AsyncStorage**: use `persist` middleware with `AsyncStorage` as the storage backend for any cross-session state.
- **fontFamily via style prop**: NativeWind doesn't map font families — always use `style={{ fontFamily: FONTS.sans }}`.
- **Auth guard in root layout**: route decisions (onboarding / login / tabs) live in `_layout.tsx` via `<Redirect>` — screens don't redirect themselves.

## What Downstream Slices Should Know
- **S03 (Authentication)** must implement `/auth/login` — after `supabase.auth.signIn`, call `router.replace('/(tabs)')`. The `onAuthStateChange` listener in `useAuth` auto-updates `useAuthStore` — no manual store update needed.
- **M003 (Mood + Journal)** can read `useOnboardingStore().goal`, `.frequency`, `.timePreference` to personalize AI prompts.
- `useAuthStore` is globally available — use it anywhere auth state is needed (profile screen, AI journal session guard).
- The AI response in `taste.tsx` is hardcoded — real Claude Haiku call is M003/S02.
- Paywall has no RevenueCat — M004/S01 adds the actual purchase flow.
- RevenueCat pricing: Rp 299.000/tahun, Rp 39.000/bulan (annual pre-selected).

## Must-Haves: All Verified
- [x] Screen 1 has CTA "Mulai Perjalananmu" navigating to Screen 2 ✓
- [x] Screen 2 shows 3 goal options; tapping highlights + stores in Zustand ✓
- [x] Screen 3 shows 4 frequency options with correct Indonesian labels ✓
- [x] Screen 4 shows 4 time options (Pagi, Siang, Sore, Malam) ✓
- [x] Screen 5 shows user's goal + frequency from Zustand ✓
- [x] Screen 6 shows hardcoded AI prompt + mood picker + response ✓
- [x] Screen 7 shows Rp 299.000/tahun AND Rp 39.000/bulan; annual pre-selected ✓
- [x] Paywall CTAs call complete() then navigate to /auth/login ✓
- [x] First launch: !isComplete → Redirect /onboarding ✓
- [x] Returning user with session: isComplete + session → Slot (tabs shown) ✓
- [x] BackHandler on Screen 1 blocks Android hardware back ✓
- [x] Progress dots update: 1/7 → 7/7 ✓
- [x] Tests: 24/24 passing ✓
- [x] TypeScript: 0 errors ✓
