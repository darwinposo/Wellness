# T01 Summary: Initialize Expo SDK 55 + Dependencies + Landmine Fixes
Completed: 2026-03-12
Status: VERIFIED

## What Was Built
Expo SDK 55 project initialized (upgraded from planned SDK 53 — latest stable). All production
dependencies installed. All 4 code-addressable landmines neutralized before first commit.
Project structure ready for navigation shell in T02.

## Key Decisions Made
- **SDK 55 instead of 53**: SDK 55 was latest at init time — used it. Landmines still apply.
- **npm --legacy-peer-deps**: Required for Supabase + Reanimated peer dep conflicts with React 19.
- **NativeWind pinned at 4.1.23**: Matches Tailwind 3.4.0 requirement; newer NW breaks with Tailwind 4.

## Files Created / Modified
- `metro.config.js` — created, landmine 1 fix (unstable_enablePackageExports: false)
- `babel.config.js` — created, NativeWind + Reanimated plugins
- `global.css` — created, Tailwind directives
- `tailwind.config.js` — created, Reflect design tokens mapped to NativeWind classes
- `app.json` — modified: scheme, bundle ID, edge-to-edge nav bar config
- `tsconfig.json` — modified: baseUrl + @/* path alias
- `eas.json` — created, 3 build profiles
- `.env.example` — created, Supabase + Anthropic keys placeholder
- `index.ts` — modified: url-polyfill first, expo-router entry
- `src/lib/supabase.ts` — created, AsyncStorage adapter (landmine 2)
- `src/lib/constants.ts` — created, COLORS, SPACING, FONTS, SHADOWS tokens

## Patterns Established
- **Landmine-first**: Apply all landmine fixes BEFORE writing any app code
- **--legacy-peer-deps**: Required flag for all npm installs in this project (React 19 peer conflicts)
- **@/* alias**: src/ directory mapped to @/ for clean imports

## Must-Haves Verification
- [x] metro.config.js has unstable_enablePackageExports: false ✓
- [x] src/lib/supabase.ts uses AsyncStorage (not SecureStore) ✓
- [x] index.ts has url-polyfill as first import ✓
- [x] eas.json has development profile with developmentClient: true ✓
- [x] app.json has scheme: "reflect" and package: "com.reflect.app" ✓
- [x] metro.config.js and babel.config.js load without errors ✓
- [x] All deps installed (package.json verified) ✓

## What Downstream Work Should Know
- Always use `npm install --legacy-peer-deps` for new packages in this project
- NativeWind is 4.1.23 — do NOT upgrade without testing (SDK 55 compat)
- Tailwind is 3.4.0 — do NOT use Tailwind 4 (NativeWind 4.x requires Tailwind 3)
- SDK is 55, not 53 — landmine notes in research.md still apply conceptually
- supabase.ts requires EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env
