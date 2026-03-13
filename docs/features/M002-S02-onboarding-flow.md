# Feature: Onboarding Flow
Implemented: 2026-03-13 | Slice: M002/S02

## What This Feature Does
New users are guided through a 7-screen onboarding flow in Bahasa Indonesia where they select their
wellness goal, journaling frequency, and preferred time of day. The app then shows a personalized
plan preview, a taste of the AI journal experience, and a paywall with IDR pricing. Selections persist
across app restarts via AsyncStorage, and the root layout routes returning users directly past
onboarding to the login or main app screen.

## User Flow

```
App Launch
    ↓
Root Layout checks AsyncStorage
    ↓ isComplete = false
Screen 1: Value Prop → "Mulai Perjalananmu"
    ↓
Screen 2: Goal Selection (3 options) → stored in Zustand
    ↓
Screen 3: Frequency (4 options) → stored in Zustand
    ↓
Screen 4: Time Preference (4 options with emoji) → stored in Zustand
    ↓
Screen 5: Personalized Plan Preview (reads from Zustand)
    ↓
Screen 6: AI Journal Taste (mock mood picker + hardcoded warm response)
    ↓
Screen 7: Paywall (Rp 299.000/tahun | Rp 39.000/bulan — annual pre-selected)
    ↓ complete() called
Login Screen (/auth/login)
```

## How to Use It (Developer Reference)

### Onboarding Store
```tsx
import { useOnboardingStore } from '@/store/onboarding';

const { goal, frequency, timePreference, isComplete, complete } = useOnboardingStore();

// Mark onboarding done (call before navigating to login)
complete();
```

### Auth Store + Hook
```tsx
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth';

// In root layout — useAuth wires Supabase to the store automatically
useAuth(); // call once in _layout.tsx

const { session, loading, isAuthenticated } = useAuthStore();
```

### Root Auth Guard Pattern
```tsx
// src/app/_layout.tsx
useAuth();
const { isComplete } = useOnboardingStore();
const { session, loading } = useAuthStore();

if (loading) return <LoadingSpinner />;
if (!isComplete) return <Redirect href="/onboarding" />;
if (!session) return <Redirect href="/auth/login" />;
return <Slot />;
```

### Adding New UI Components
- **ProgressDots**: `<ProgressDots current={3} total={7} />`
- **PricingCard**: `<PricingCard price="Rp 299.000" period="tahun" badge="Hemat 37%" selected />`

## Screens

| Route | Screen | Key State |
|-------|--------|-----------|
| `/onboarding` | Value Prop | — |
| `/onboarding/goal` | Goal Selection | `goal` in store |
| `/onboarding/frequency` | Frequency | `frequency` in store |
| `/onboarding/time` | Time Preference | `timePreference` in store |
| `/onboarding/preview` | Plan Preview | reads `goal`, `frequency` |
| `/onboarding/taste` | AI Taste | local `useState` only |
| `/onboarding/paywall` | Paywall | calls `complete()` on CTA tap |

## Pricing (IDR)
- Annual: **Rp 299.000/tahun** (~Rp 24.900/bulan) — pre-selected
- Monthly: **Rp 39.000/bulan**
- RevenueCat integration: M004/S01

## Troubleshooting
| Problem | Cause | Solution |
|---------|-------|---------|
| App always shows onboarding on relaunch | `isComplete` not persisted | Check AsyncStorage persist in `src/store/onboarding.ts` |
| Plan preview shows "undefined" | `goal`/`frequency` not set in store | Check store reads in `preview.tsx` |
| Back button exits app on Screen 1 | BackHandler not registered | Check `useEffect` in `src/app/onboarding/index.tsx` |
| Paywall CTA crashes | `complete()` not called before navigate | Call `complete()` first, then `router.replace('/auth/login')` |
| Session not persisted | Supabase not using AsyncStorage adapter | Check `src/lib/supabase.ts` — `auth.storage: AsyncStorage` required |
