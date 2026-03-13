# T01 Summary: Onboarding Screens 1–4
Completed: 2026-03-13
Status: VERIFIED

## What Was Built
Zustand onboarding store with AsyncStorage persistence, a reusable ProgressDots component, and 4 complete
onboarding screens (Value Prop, Goal, Frequency, Time Preference) with full Bahasa Indonesia copy,
selection state wired to the store, disabled CTA until selection made, and forward navigation.

## Key Decisions Made
- Button uses `label` prop (not `children`) — matched existing Button component API
- `expo/src/winter` mocked via `moduleNameMapper` (not `setupFiles`) — only way to prevent jest-expo's preset from crashing on Expo SDK 55's new-arch runtime in Node env
- Android set as default Jest platform (`haste: { defaultPlatform: 'android' }`)
- `/onboarding/preview` route typed with `as any` — route doesn't exist yet (built in T02), satisfies TS until then

## Files Produced
| File | Purpose | Notes |
|------|---------|-------|
| `src/store/onboarding.ts` | Zustand store — goal/frequency/timePreference/isComplete | AsyncStorage persist |
| `src/components/ui/ProgressDots.tsx` | 7-dot progress indicator | current/total props |
| `src/app/onboarding/index.tsx` | Screen 1 — Value Prop | Hero + CTA |
| `src/app/onboarding/goal.tsx` | Screen 2 — Goal selection | 3 cards |
| `src/app/onboarding/frequency.tsx` | Screen 3 — Frequency | 4 options |
| `src/app/onboarding/time.tsx` | Screen 4 — Time Preference | 4 options with emoji |
| `jest.config.js` | Jest setup for Expo SDK 55 | expo-winter mock, android platform |
| `tests/store/onboarding.test.ts` | 7 store tests | all passing |
| `tests/components/ProgressDots.test.tsx` | 3 component tests | all passing |

## Patterns Established
- **SelectionCard**: `TouchableOpacity` with `borderWidth: 2`, `borderColor: brandPrimary when selected`, `SHADOWS.card when not selected`. Used in goal, time, frequency screens — T02 should reuse exact same pattern.
- **ScreenLayout**: `flex-1 justify-between px-6 py-8` with `flex-1` content area and fixed bottom `gap-6` containing ProgressDots + Button.
- **Disabled CTA**: Pass `disabled={!selectedValue}` to Button — opacity handled internally by Button component.

## Must-Haves Verification
- [x] Screen 1 has CTA "Mulai Perjalananmu" navigating to Screen 2 ✓
- [x] Screen 2 shows 3 goal options; tapping highlights + stores in Zustand ✓
- [x] Screen 3 shows 4 frequency options with correct Indonesian labels ✓
- [x] Screen 4 shows 4 time options (Pagi, Siang, Sore, Malam) ✓
- [x] Progress dots update correctly (1/7 → 4/7) ✓
- [x] `src/store/onboarding.ts` — exists, Zustand + AsyncStorage persist ✓
- [x] `src/components/ui/ProgressDots.tsx` — exists, current/total props ✓
- [x] All 4 screen files exist ✓
- [x] All screens import useOnboardingStore ✓
- [x] Tests: 10/10 passing ✓
- [x] TypeScript: 0 errors ✓

## What Downstream Work Should Know
- T02 screens (preview, taste, paywall) should use the same SelectionCard and ScreenLayout patterns
- `useOnboardingStore().goal`, `.frequency`, `.timePreference` are all populated after T01 flow
- `/onboarding/preview` is the next route (T02's first screen)
- Android back button handled by Expo Router's Stack with `gestureEnabled: true` — no custom handler needed
