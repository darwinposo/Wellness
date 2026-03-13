# T03 Summary: Design Token Integration (NativeWind + Button + Card)
Completed: 2026-03-12
Status: VERIFIED

## What Was Built
Button component (3 variants × 3 sizes, loading/disabled states) and Card component (shadow,
16px radius) both using NativeWind className with design tokens. Today screen updated to render
both components proving the full token pipeline: constants.ts → tailwind.config.js → NativeWind
className → device render. TypeScript: 0 errors.

## Key Decisions Made
- **fontFamily via style prop**: NativeWind doesn't support custom font families via className —
  must use `style={{ fontFamily: 'PlusJakartaSans_600SemiBold' }}` alongside className
- **elevation + shadow**: Card uses both `elevation` (Android) and `shadow*` props (iOS) for cross-platform shadow

## Files Created
- `src/components/ui/Button.tsx` — 3 variants, 3 sizes, loading/disabled, 80 lines
- `src/components/ui/Card.tsx` — base card with cross-platform shadow, 30 lines
- `src/components/ui/index.ts` — barrel export for all UI components

## Files Modified
- `src/app/(tabs)/index.tsx` — updated with Button + Card smoke test

## Patterns Established
- **fontFamily always via style prop**: Never in className — NativeWind doesn't map font families
- **className for color/spacing/radius, style for font/shadow**: split responsibility pattern
- **Barrel export from ui/index.ts**: Import components as `@/components/ui` not individual files

## Must-Haves Verification
- [x] tailwind.config.js has brand-primary → #D4724A ✓
- [x] NativeWind preset configured ✓
- [x] NativeWind babel plugin in babel.config.js ✓
- [x] Button uses bg-brand-primary className ✓
- [x] Card uses rounded-card token ✓
- [x] Card has elevation (Android shadow) ✓
- [x] Today screen renders Button + Card ✓
- [x] TypeScript: 0 errors ✓

## What Downstream Work Should Know
- Font family MUST use `style={{ fontFamily: FONTS.sans }}` — not className
- All future components follow: className for tokens, style for platform-specific
- `@/components/ui` is the import path (barrel export)
- NativeWind is pinned at 4.1.23 — do NOT upgrade
