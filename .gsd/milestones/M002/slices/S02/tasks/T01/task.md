# T01: Onboarding Screens 1–4 (Value Prop, Goal, Frequency, Time)
Slice: M002/S02
Created: 2026-03-12

## Goal
Build the first 4 onboarding screens with full Bahasa Indonesia copy, correct visual design from the prototype, selection state management, and forward/back navigation.

## Steps
1. Create `src/store/onboarding.ts` with Zustand + AsyncStorage persistence
2. Create `src/app/onboarding/_layout.tsx` — stack navigator, no header
3. Create Screen 1: `src/app/onboarding/index.tsx` — value prop + hero animation placeholder
4. Create Screen 2: `src/app/onboarding/goal.tsx` — 3 goal cards (Kelola Stres, Tidur Lebih Baik, Lebih Bahagia)
5. Create Screen 3: `src/app/onboarding/frequency.tsx` — 4 frequency options
6. Create Screen 4: `src/app/onboarding/time.tsx` — 4 time preferences
7. Add progress indicator component (dots, 7 total)
8. Wire back navigation to hardware back button on Android

## Must-Haves

### Truths
- [ ] Screen 1 has CTA "Mulai Perjalananmu" that navigates to Screen 2
- [ ] Screen 2 shows 3 goal options; tapping one highlights it and stores in Zustand
- [ ] Screen 3 shows 4 frequency options with correct Indonesian labels
- [ ] Screen 4 shows 4 time options (Pagi, Siang, Sore, Malam)
- [ ] Progress dots update correctly on each screen (1/7 → 4/7)
- [ ] Android hardware back button works on all screens

### Artifacts
- [ ] `src/store/onboarding.ts` — exists, Zustand store with goal/frequency/time fields
- [ ] `src/app/onboarding/index.tsx` — exists, renders Screen 1
- [ ] `src/app/onboarding/goal.tsx` — exists, renders 3 selectable goal cards
- [ ] `src/app/onboarding/frequency.tsx` — exists, renders 4 frequency options
- [ ] `src/app/onboarding/time.tsx` — exists, renders 4 time options
- [ ] `src/components/ui/ProgressDots.tsx` — exists, takes `current` and `total` props

### Key Links
- [ ] All 4 screens import `useOnboardingStore` and read/write state
- [ ] Each screen's CTA calls `router.push('/onboarding/[next]')`
- [ ] `onboarding.ts` uses `zustand/middleware` `persist` with AsyncStorage

## Copy (Bahasa Indonesia)

### Screen 1 — Value Prop
```
Headline: "Teman curhat AI-mu ada di sini"
Subtext:  "Reflect membantu kamu memahami perasaan, mengelola stres, dan tumbuh setiap hari — dengan pendampingan AI yang hangat dan personal."
CTA:      "Mulai Perjalananmu"
```

### Screen 2 — Goal
```
Title:    "Apa tujuan utamamu?"
Subtext:  "Kami akan menyesuaikan pengalamanmu."
Option 1: "😌 Kelola Stres" — "Kurangi kecemasan sehari-hari"
Option 2: "😴 Tidur Lebih Baik" — "Tenangkan pikiran sebelum tidur"
Option 3: "😊 Lebih Bahagia" — "Tingkatkan suasana hati secara konsisten"
CTA:      "Lanjut"
```

### Screen 3 — Frequency
```
Title:    "Seberapa sering kamu ingin check-in?"
Option 1: "Setiap hari"
Option 2: "4–5x seminggu"
Option 3: "2–3x seminggu"
Option 4: "Saat butuh saja"
CTA:      "Lanjut"
```

### Screen 4 — Time Preference
```
Title:    "Kapan waktu terbaikmu?"
Option 1: "🌅 Pagi" — "Mulai hari dengan niat positif"
Option 2: "☀️ Siang" — "Jeda sejenak di tengah hari"
Option 3: "🌇 Sore" — "Refleksi setelah aktivitas"
Option 4: "🌙 Malam" — "Akhiri hari dengan tenang"
CTA:      "Lanjut"
```

## Onboarding Store Template
```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Goal = 'stress' | 'sleep' | 'happiness' | null;
export type Frequency = 'daily' | '4-5x' | '2-3x' | 'as-needed' | null;
export type TimePreference = 'morning' | 'midday' | 'afternoon' | 'night' | null;

interface OnboardingState {
  goal: Goal;
  frequency: Frequency;
  timePreference: TimePreference;
  isComplete: boolean;
  setGoal: (goal: Goal) => void;
  setFrequency: (freq: Frequency) => void;
  setTimePreference: (time: TimePreference) => void;
  complete: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      goal: null, frequency: null, timePreference: null, isComplete: false,
      setGoal: (goal) => set({ goal }),
      setFrequency: (frequency) => set({ frequency }),
      setTimePreference: (timePreference) => set({ timePreference }),
      complete: () => set({ isComplete: true }),
      reset: () => set({ goal: null, frequency: null, timePreference: null, isComplete: false }),
    }),
    {
      name: 'reflect-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

## Notes
- Install Zustand: `npm install zustand`
- Selection card style: background white, border 2px brand/primary when selected, card radius 16px, card shadow
- Progress dots: filled circle = completed, filled brand/primary = current, empty circle = future
- `_layout.tsx` for onboarding: `<Stack screenOptions={{ headerShown: false, gestureEnabled: true }} />`
