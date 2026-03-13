# Feature: Project Scaffold
Implemented: 2026-03-12 | Slice: M002/S01

## What This Feature Does
Sets up the complete Reflect app foundation: Expo SDK 55 project with all production
dependencies, all critical landmines neutralized, a 4-tab navigation shell with Indonesian
labels, and a NativeWind design token pipeline from constants → Tailwind → device render.
This is the greenfield scaffold that all future features are built on.

## Architecture

```
index.ts                          ← url-polyfill first, then expo-router
src/
  app/
    _layout.tsx                   ← root: SafeAreaProvider + fonts
    (tabs)/
      _layout.tsx                 ← 4-tab bar: Hari Ini, Jurnal, Wawasan, Profil
      index.tsx                   ← Today stub
      journal.tsx                 ← Jurnal stub
      insights.tsx                ← Wawasan stub
      profile.tsx                 ← Profil stub
    onboarding/
      _layout.tsx                 ← onboarding stack
      index.tsx                   ← Screen 1 stub
    auth/
      login.tsx                   ← Login stub
  lib/
    supabase.ts                   ← Supabase client (AsyncStorage adapter)
    constants.ts                  ← COLORS, SPACING, FONTS, SHADOWS
  components/
    ui/
      SafeScreen.tsx              ← SafeAreaView wrapper (use on every screen)
      Button.tsx                  ← 3 variants × 3 sizes
      Card.tsx                    ← rounded card with cross-platform shadow
      index.ts                    ← barrel export
```

## Critical Landmines Neutralized

| Landmine | File | Fix Applied |
|----------|------|-------------|
| Supabase metro crash | `metro.config.js` | `unstable_enablePackageExports: false` |
| Supabase AsyncStorage | `src/lib/supabase.ts` | AsyncStorage adapter (not SecureStore) |
| URL polyfill | `index.ts` | First import: `react-native-url-polyfill/auto` |
| NativeWind inlineRem | `metro.config.js` | `inlineNativeRem: 16` |
| Lottie format | (docs) | Use `.json` only — `.lottie` crashes Android |
| Expo Go push notifs | (docs) | Use EAS dev build — no push in Expo Go |
| Edge-to-edge nav | `app.json` | `navigationBar.backgroundColor` set |

## Design Tokens

Colors (from `src/lib/constants.ts` and `tailwind.config.js`):
```typescript
COLORS.brandPrimary    = '#D4724A'  // terracotta — brand-primary in Tailwind
COLORS.brandSecondary  = '#F5A623'  // amber
COLORS.surface         = '#FFFFFF'
COLORS.background      = '#FAF9F7'
COLORS.textPrimary     = '#1A1A1A'
COLORS.textSecondary   = '#6B7280'
```

NativeWind usage pattern:
```typescript
// ✓ Correct: className for color/spacing/radius
<View className="bg-brand-primary px-4 py-3 rounded-xl" />

// ✓ Correct: style prop for font family
<Text style={{ fontFamily: FONTS.sans }} className="text-white text-base" />

// ✗ Wrong: font family in className (NativeWind doesn't map it)
<Text className="font-sans" />
```

## UI Components

### `<SafeScreen>`
Every screen must use SafeScreen. Never use bare `<View>` at screen root.
```typescript
import { SafeScreen } from '@/components/ui'

export default function MyScreen() {
  return (
    <SafeScreen>
      {/* your content */}
    </SafeScreen>
  )
}
```

### `<Button>`
```typescript
import { Button } from '@/components/ui'

<Button variant="primary" size="md" onPress={handlePress}>
  Mulai Jurnal
</Button>

// Variants: 'primary' | 'secondary' | 'ghost'
// Sizes: 'sm' | 'md' | 'lg'
// Also: loading={true}, disabled={true}
```

### `<Card>`
```typescript
import { Card } from '@/components/ui'

<Card>
  <Text>Content here</Text>
</Card>
```

## Supabase Client
```typescript
import { supabase } from '@/lib/supabase'

// Already configured with AsyncStorage session persistence
// Requires .env with:
// EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
// EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

## Navigation Routes
| Route | Purpose |
|-------|---------|
| `/(tabs)` | Main app — 4-tab shell |
| `/(tabs)/` | Today screen |
| `/(tabs)/journal` | Journal screen |
| `/(tabs)/insights` | Insights screen |
| `/(tabs)/profile` | Profile screen |
| `/onboarding` | Onboarding stack |
| `/auth/login` | Login screen |

## Development Setup

### Install deps
```bash
npm install --legacy-peer-deps
# Always use --legacy-peer-deps in this project (React 19 peer conflicts)
```

### Run dev
```bash
npx expo start --dev-client
```

### Build APK (debug)
```bash
cd android && ./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|---------|
| `Package "stream" not found` | `unstable_enablePackageExports` not set | Check metro.config.js |
| `AsyncStorage has been removed` | Wrong Supabase auth storage | Check supabase.ts uses AsyncStorage |
| White screen on launch | Metro not running | Run `npx expo start --dev-client` |
| Font not loading | Font name typo | Check `_layout.tsx` useFonts keys |
| NativeWind className not applying | Missing babel plugin | Check `babel.config.js` NativeWind plugin |
| `npm install` fails | React 19 peer conflicts | Always use `--legacy-peer-deps` |
