# S01: Project Scaffold
Milestone: M002
Created: 2026-03-12
Iteration: 1

## Demo Sentence
After this slice, the developer can run the Reflect app on a physical Android device via EAS development build, see the 4-tab navigation shell with screen stubs, and confirm NativeWind + Supabase + Skia are all wired up without crashes.

## Boundary Map

### Produces
- `src/app/_layout.tsx` → root layout with SafeAreaProvider + auth guard stub
- `src/app/(tabs)/_layout.tsx` → tab bar: Today, Journal, Insights, Profile
- `src/app/(tabs)/index.tsx` → Today stub screen
- `src/app/(tabs)/journal.tsx` → Journal stub screen
- `src/app/(tabs)/insights.tsx` → Insights stub screen
- `src/app/(tabs)/profile.tsx` → Profile stub screen
- `src/lib/supabase.ts` → exports: `supabase` (configured client)
- `src/lib/constants.ts` → exports: `COLORS`, `SPACING`, `FONTS`
- `src/components/ui/SafeScreen.tsx` → exports: `SafeScreen` component
- `metro.config.js` → landmine fix applied
- `app.json` → bundle ID, deep link scheme, edge-to-edge config
- `eas.json` → development + preview + production profiles
- `tailwind.config.js` → NativeWind config with design tokens
- `global.css` → design token CSS vars

### Consumes
- Nothing — greenfield

## Tasks
- T01: Init Expo SDK 53 project + all deps + all landmine fixes
- T02: Navigation shell (Expo Router tabs + screen stubs)
- T03: Design token integration (NativeWind applied, SafeScreen component)

## Must-Haves (Slice Level)

### Truths
- [ ] `npx expo start` runs without errors
- [ ] App loads on physical Android device via EAS dev build
- [ ] Tab bar shows 4 tabs: Today, Journal, Insights, Profile
- [ ] No crash on launch (Supabase + metro fix verified)
- [ ] NativeWind className works on at least one component (bg-brand-primary renders terracotta)
- [ ] All 7 critical landmines addressed in code

### Artifacts
- [ ] `metro.config.js` exists, contains `unstable_enablePackageExports: false`
- [ ] `src/lib/supabase.ts` exists, uses AsyncStorage adapter
- [ ] `src/app/_layout.tsx` exists, wraps with SafeAreaProvider
- [ ] `src/app/(tabs)/_layout.tsx` exists, 4 tabs defined
- [ ] `eas.json` exists with development profile
- [ ] `tailwind.config.js` exists with brand/primary → #D4724A

### Key Links
- [ ] Entry file imports `react-native-url-polyfill/auto` as first line
- [ ] `src/lib/supabase.ts` auth storage uses AsyncStorage (not SecureStore)
- [ ] All tab screens wrapped in `SafeScreen` component
