# T02 Summary: Navigation Shell (Expo Router Tabs + Screen Stubs)
Completed: 2026-03-12
Status: VERIFIED

## What Was Built
Complete Expo Router v3 navigation structure: root layout with SafeAreaProvider + font loading,
4-tab bar with Indonesian labels and brand tokens, stub screens for all 4 tabs, onboarding stack
navigator, auth login stub, and SafeScreen component wrapping all screens for edge-to-edge safety.

## Key Decisions Made
- **expo-router root in src/app**: Set via `["expo-router", { "root": "./src/app" }]` in app.json
- **@expo/vector-icons**: Used for tab icons — ships with Expo, no extra binary
- **global.css at project root**: Imported via `../../global.css` from src/app/_layout.tsx

## Files Created
- `src/app/_layout.tsx` — root layout, SafeAreaProvider, font loading (PJS + Lora)
- `src/app/(tabs)/_layout.tsx` — 4-tab bar, brand tokens, Indonesian labels
- `src/app/(tabs)/index.tsx` — Today stub
- `src/app/(tabs)/journal.tsx` — Jurnal stub
- `src/app/(tabs)/insights.tsx` — Wawasan stub
- `src/app/(tabs)/profile.tsx` — Profil stub
- `src/app/onboarding/_layout.tsx` — onboarding stack (headerShown: false)
- `src/app/onboarding/index.tsx` — Screen 1 stub
- `src/app/auth/login.tsx` — Login stub
- `src/components/ui/SafeScreen.tsx` — SafeAreaView wrapper (Landmine 8 fix)

## Patterns Established
- **SafeScreen**: Every screen uses SafeScreen — never raw View at screen level
- **Indonesian copy**: All user-visible strings in Bahasa Indonesia from day 1
- **COLORS from constants**: Tab bar and SafeScreen use COLORS constants, not hardcoded hex

## Must-Haves Verification
- [x] All 10 files exist ✓
- [x] Tab bar: Hari Ini, Jurnal, Wawasan, Profil — verified ✓
- [x] Active tab uses COLORS.brandPrimary (#D4724A) ✓
- [x] All tab screens import SafeScreen ✓
- [x] Root layout has SafeAreaProvider ✓
- [x] TypeScript: 0 errors ✓
- [x] Onboarding route at /onboarding ✓
- [x] Auth route at /auth/login ✓

## What Downstream Work Should Know
- Expo Router root is `src/app` — configured in app.json expo-router plugin
- `@/` resolves to `src/` — defined in tsconfig.json paths
- All screens must use `<SafeScreen>` — never bare `<View>` at top level
- Tab screens have `paddingBottom` from SafeScreen insets — don't add extra bottom padding
