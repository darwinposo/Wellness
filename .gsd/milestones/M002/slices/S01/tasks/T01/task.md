# T01: Initialize Expo SDK 53 + Dependencies + Landmine Fixes
Slice: M002/S01
Created: 2026-03-12

## Goal
Create the Reflect Expo project with all required dependencies installed, all 8 critical landmines neutralized, EAS configured, and the app booting without errors on Android.

## Steps
1. Initialize project: `npx create-expo-app@latest Reflect --template blank-typescript`
2. Apply Landmine 1 IMMEDIATELY: add `unstable_enablePackageExports: false` to `metro.config.js`
3. Install all dependencies (see list below)
4. Apply Landmine 3: add `import 'react-native-url-polyfill/auto'` as first line of `src/app/_layout.tsx`
5. Configure `app.json`: bundle ID, scheme, androidNavigationBar
6. Create `eas.json` with development + preview + production profiles
7. Create `src/lib/supabase.ts` with AsyncStorage adapter (Landmine 2)
8. Create `src/lib/constants.ts` with design token values
9. Run `npx expo start` — confirm no errors
10. Configure EAS project: `eas init` (requires EAS account)

## Dependencies to Install

```bash
# Core
npx expo install expo-router react-native-safe-area-context react-native-screens

# Styling
npx expo install nativewind@4.1.23
npm install --save-dev tailwindcss@3.4.0

# Supabase
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill

# Animations
npx expo install react-native-reanimated

# Graphics
npx expo install @shopify/react-native-skia

# Lottie
npx expo install lottie-react-native

# AI
npm install @anthropic-ai/sdk

# EAS
npm install -g eas-cli
```

## Must-Haves

### Truths
- [ ] `npx expo start` exits with no errors
- [ ] `metro.config.js` has `unstable_enablePackageExports: false`
- [ ] `src/lib/supabase.ts` uses AsyncStorage (not SecureStore)
- [ ] Entry file has `import 'react-native-url-polyfill/auto'` as first import
- [ ] `eas.json` has development profile with `developmentClient: true`
- [ ] `app.json` has `scheme: "reflect"` and `bundleIdentifier: "com.reflect.app"`

### Artifacts
- [ ] `metro.config.js` — exists, landmine fix present
- [ ] `app.json` — bundle ID, scheme, edge-to-edge config
- [ ] `eas.json` — 3 profiles: development, preview, production
- [ ] `src/lib/supabase.ts` — exists, exports `supabase` client
- [ ] `src/lib/constants.ts` — exists, exports COLORS + SPACING + FONTS
- [ ] `package.json` — all deps listed above present

### Key Links
- [ ] `metro.config.js` exports config with `resolver.unstable_enablePackageExports = false`
- [ ] `supabase.ts` imports AsyncStorage from `@react-native-async-storage/async-storage`

## File Templates

### metro.config.js
```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
config.resolver.unstable_enablePackageExports = false; // Landmine 1 fix

module.exports = withNativeWind(config, { input: './global.css' });
```

### app.json (key additions)
```json
{
  "expo": {
    "scheme": "reflect",
    "android": {
      "package": "com.reflect.app",
      "adaptiveIcon": { ... },
      "navigationBar": { "barStyle": "dark-content" }
    }
  }
}
```

### eas.json
```json
{
  "cli": { "version": ">= 5.9.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### src/lib/supabase.ts
```ts
import 'react-native-url-polyfill/auto'; // Landmine 3
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Landmine 2 fix — NOT SecureStore
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### src/lib/constants.ts
```ts
export const COLORS = {
  bgPrimary: '#FAF8F5',
  surface: '#FFFFFF',
  brandPrimary: '#D4724A',
  brandSecondary: '#4A7D8C',
  moodPositive: '#7DB87A',
  moodNegative: '#C4735A',
  textPrimary: '#1A1A22',
  textMuted: '#6E6E7E',
  border: '#E2E2E8',
  error: '#D94F4F',
  success: '#3D9A5C',
} as const;

export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
  screenEdge: 24, cardPadding: 16, cardRadius: 16,
} as const;

export const FONTS = {
  sans: 'PlusJakartaSans',
  journal: 'Lora',
} as const;
```

## Notes
- NativeWind must be pinned to `4.1.23` — newer versions have SDK 53 conflicts
- `tailwindcss` must be `3.4.0` — NativeWind 4.x requires Tailwind 3, not 4
- Do NOT install `react-native-worklets` separately — it ships inside Reanimated v3 (Landmine 7)
- EAS init requires a free Expo account — create one at expo.dev if needed
- Create `.env` file with Supabase URL + anon key (from Supabase dashboard → Singapore region)
