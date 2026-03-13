# Changelog — S01: Project Scaffold

## [S01] - 2026-03-12

### Added
- Expo SDK 55 project initialized with all production dependencies
- `metro.config.js` — Landmine 1 fix: `unstable_enablePackageExports: false` + NativeWind metro integration
- `babel.config.js` — NativeWind + Reanimated babel plugins configured
- `tailwind.config.js` — design tokens (brand-primary #D4724A, brand-secondary #4A7D8C, etc.) mapped to NativeWind
- `global.css` — Tailwind directives at project root
- `eas.json` — development (developmentClient), preview, production build profiles
- `src/lib/constants.ts` — COLORS, SPACING, FONTS, SHADOWS as TypeScript constants
- `src/lib/supabase.ts` — Supabase client with AsyncStorage adapter (Landmine 2 fix) + env var fallbacks
- `src/app/_layout.tsx` — root layout: SafeAreaProvider, non-blocking font load, SplashScreen management
- `src/app/(tabs)/_layout.tsx` — 4-tab bar: Hari Ini / Jurnal / Wawasan / Profil with brandPrimary active color
- `src/app/(tabs)/index.tsx` — Today screen with Button + Card smoke test
- `src/app/(tabs)/journal.tsx`, `insights.tsx`, `profile.tsx` — stub screens using SafeScreen
- `src/app/onboarding/_layout.tsx` — onboarding stack navigator (headerShown: false)
- `src/app/onboarding/index.tsx` — Screen 1 stub (S02 will fill in)
- `src/app/auth/login.tsx` — Login stub (S03 will fill in)
- `src/components/ui/Button.tsx` — 3 variants (primary/secondary/ghost) × 3 sizes, loading + disabled states
- `src/components/ui/Card.tsx` — cross-platform shadow (elevation + shadow*), 16px radius
- `src/components/ui/SafeScreen.tsx` — SafeAreaView wrapper (Landmine 8 fix)
- `src/components/ui/index.ts` — barrel export for all UI components

### Fixed (post-verify)
- `src/lib/supabase.ts` — replaced non-null `!` assertions with `?? 'placeholder'` fallbacks (crash fix when .env missing)
- `src/app/_layout.tsx` — removed `if (!fontsLoaded && !fontError) return null` guard that blocked render indefinitely

### Technical Notes
- Expo SDK 55 used instead of planned SDK 53 — latest stable at init time; all landmines still apply
- All npm installs require `--legacy-peer-deps` (React 19 peer dep conflicts with several packages)
- NativeWind pinned at 4.1.23 with Tailwind 3.4.0 — do NOT upgrade (NW 4.x is Tailwind 3 only)
- expo-router root configured via `expo.router.root: "src/app"` in app.json (not as plugin option)
- fontFamily must use `style={{ fontFamily: FONTS.sans }}` — NativeWind doesn't map custom font families via className
