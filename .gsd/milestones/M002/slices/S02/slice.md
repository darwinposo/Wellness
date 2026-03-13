# S02: Onboarding Flow
Milestone: M002
Created: 2026-03-12
Iteration: 1

## Demo Sentence
After this slice, the user can tap through all 7 onboarding screens, select their goal/frequency/time preferences, see the personalized plan preview, get a taste of the AI journal feature, and reach the paywall screen.

## Boundary Map

### Produces
- `src/app/onboarding/index.tsx` → Screen 1: Value prop
- `src/app/onboarding/goal.tsx` → Screen 2: Goal selection (3 options)
- `src/app/onboarding/frequency.tsx` → Screen 3: Frequency selection
- `src/app/onboarding/time.tsx` → Screen 4: Time preference
- `src/app/onboarding/preview.tsx` → Screen 5: Personalized plan preview
- `src/app/onboarding/taste.tsx` → Screen 6: Value taste (mock AI response)
- `src/app/onboarding/paywall.tsx` → Screen 7: Paywall + login trigger
- `src/store/onboarding.ts` → exports: `useOnboardingStore`, `OnboardingState`

### Consumes
- From S01: `SafeScreen`, `Button`, `Card` components
- From S01: `COLORS`, `SPACING` constants

## Tasks
- T01: Screens 1–4 (Value prop, Goal, Frequency, Time)
- T02: Screens 5–7 (Plan preview, Value taste, Paywall)
- T03: Onboarding state + completion flow

## Must-Haves (Slice Level)

### Truths
- [ ] User can tap forward through all 7 screens without crashes
- [ ] Back navigation works (hardware back + on-screen back button)
- [ ] Goal selection: one of 3 options visually selected, stored in state
- [ ] Frequency selection: one of 4 options visually selected, stored in state
- [ ] Time preference: one of 4 options visually selected, stored in state
- [ ] Plan preview reflects user's selections (shows their goal + frequency)
- [ ] Paywall shows Rp 299.000/tahun and Rp 39.000/bulan
- [ ] All copy is in Bahasa Indonesia

### Artifacts
- [ ] All 7 screen files exist under `src/app/onboarding/`
- [ ] `src/store/onboarding.ts` exists, exports `useOnboardingStore`
- [ ] Onboarding progress indicator visible on screens 2–6 (dots or bar)

### Key Links
- [ ] All screens use `SafeScreen` wrapper
- [ ] All screens use `Button` component for CTAs
- [ ] `useOnboardingStore` persists to AsyncStorage (survives app restart)
