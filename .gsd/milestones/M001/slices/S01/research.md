# Research: Reflect App — Foundational Stack
Date: 2026-03-11
Scope: Full project pre-planning research (pre-milestone)

## Codebase Findings
Greenfield project — no existing code. All patterns established fresh.

---

## Don't Hand-Roll

| What | Use Instead | Why |
|------|-------------|-----|
| IAP receipt validation | **RevenueCat** (`react-native-purchases`) | Free until $2,500 MTR. Receipt validation is a moving target (Google/Apple API changes). Entitlements system simplifies feature gating. Solo builder cannot maintain this. |
| In-app purchases directly | **RevenueCat** (not `expo-iap` or `react-native-iap` bare) | RevenueCat wraps both; handles edge cases, refunds, trial periods |
| Push notification delivery | **Expo Push Notification Service** (not direct FCM) | Abstracts FCM/APNs, handles batching, unified token format |
| Mood/journal visualizations | **React Native Skia** | SVG has zero GPU acceleration. Skia runs on GPU — 60/120fps. Never use `react-native-svg` for animated paths. |
| Supabase auth storage | **AsyncStorage adapter** | SecureStore has a hard 2048-byte limit. Supabase JWT exceeds this. Direct SecureStore usage = silent fail → hard crash. |
| Server-side subscription state | **RevenueCat webhooks** | Never store subscription state client-side only — users can manipulate it |
| Tailwind-style CSS | **NativeWind v4** (pinned version) | Don't hand-roll CSS-to-StyleSheet transform — NativeWind handles RN-specific quirks |
| AI conversation memory | **Sliding window** (last 15 message pairs) | Claude's context window is 200K tokens — trim manually by message count, not token count. Use AsyncStorage for local persistence. |
| System prompt per-request | **Prompt caching** (`cache_control: ephemeral`) | Cached at $0.10/MTok vs $1.00/MTok standard — pays back on first repeat call |

---

## Critical Landmines (Will Break Your App)

### Landmine 1 — Supabase + SDK 53 = Crash on Launch
**What happens:** App crashes immediately on first launch with: `The package at 'node_modules/ws/lib/stream.js' attempted to import the Node standard library module 'stream'`
**Why:** Expo SDK 53 enables Metro `package.json exports` by default. Supabase's `ws` module imports Node stdlib — incompatible.
**Fix:** Add to `metro.config.js` immediately after project creation:
```js
config.resolver.unstable_enablePackageExports = false;
```
**Status:** Open bug. Supabase team working on fix. This workaround is the only path for SDK 53.

### Landmine 2 — SecureStore 2048-byte Hard Limit
**What happens:** App works fine in development, silently fails, then hard-crashes when Supabase session JWT exceeds 2048 bytes.
**Why:** SecureStore is not designed for large data blobs. Supabase JWTs are large.
**Fix:** Use AsyncStorage adapter for Supabase auth:
```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
const supabase = createClient(url, key, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false }
});
```

### Landmine 3 — Missing URL Polyfill
**What happens:** Supabase URL parsing fails silently, auth calls return mysterious errors.
**Fix:** Add as FIRST import in entry file:
```ts
import 'react-native-url-polyfill/auto';
```

### Landmine 4 — RLS Off by Default
**What happens:** Tables created via SQL migrations have Row Level Security disabled. All users can read all data.
**Fix:** After every table creation:
```sql
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user owns rows" ON journal_entries USING ((SELECT auth.uid()) = user_id);
CREATE INDEX ON journal_entries(user_id); -- required for RLS performance
```
**Note:** Dashboard Table Editor enables RLS by default. SQL editor does NOT.

### Landmine 5 — Expo Go Doesn't Support Push Notifications (SDK 53+)
**What happens:** Push notification testing is completely impossible in Expo Go on Android for SDK 53+.
**Fix:** Set up EAS Build + development build from day 1. Do not rely on Expo Go past basic UI iteration.
**Requirement:** Physical Android device for all notification testing — emulators don't support push.

### Landmine 6 — NativeWind Hot Reload Unreliable
**What happens:** New `className` values don't apply on hot reload. You see unstyled components.
**Fix:** Restart bundler (`r` in terminal) or clear cache (`npx expo start --clear`). Budget 10-15 minutes/day for this friction.
**Prevention:** Pin NativeWind to a tested version (`4.1.x`). Validate className hot reload works before building core UI.

### Landmine 7 — NativeWind v4.2.0 + SDK 53 Babel Conflict
**What happens:** Babel error: `Cannot find module react-native-worklets/plugin` when both NativeWind and Reanimated plugins installed.
**Why:** Reanimated v4 includes worklets internally. Do NOT install both.
**Fix:** Remove `react-native-worklets/plugin` from babel.config.js if present. Only keep `react-native-reanimated/plugin`.

### Landmine 8 — Edge-to-Edge Layout (Android)
**What happens:** UI elements overlap with status bar / navigation bar on Android (mandatory in Android 16 / June 2025).
**Fix:** Use `react-native-safe-area-context` `SafeAreaView` wrapping ALL screens. Configure in app.json:
```json
"androidNavigationBar": { "barStyle": "dark-content" }
```

---

## Tech Stack Confirmed

| Layer | Package | Version | Notes |
|-------|---------|---------|-------|
| Expo SDK | `expo` | SDK 53 | Latest stable. New Architecture on by default. |
| React | `react` | 19.0.0 | Ships with SDK 53. Watch for peer dep conflicts. |
| React Native | `react-native` | 0.79 | Ships with SDK 53. |
| Navigation | `expo-router` | v3 | File-based routing. |
| Styling | `nativewind` | 4.1.x (pinned) | Validate hot reload before depending on it. |
| Animations | `react-native-reanimated` | ~3.16.7 | Check compat table for SDK 53 exact pin. |
| GPU Graphics | `@shopify/react-native-skia` | Latest SDK 53 compat | Use `with-skia` template. |
| Micro-animations | `lottie-react-native` | Latest | Free animations at lottiefiles.com |
| Backend | `@supabase/supabase-js` | 2.x | Apply metro.config.js workaround immediately. |
| Auth storage | `@react-native-async-storage/async-storage` | Latest | NOT SecureStore directly. |
| URL polyfill | `react-native-url-polyfill` | Latest | Must be first import in entry file. |
| AI | `@anthropic-ai/sdk` | Latest | claude-haiku-4-5-20251001 model ID. |
| Push | `expo-notifications` | SDK 53 compat | Requires EAS Build + FCM V1 credentials. |
| IAP | `react-native-purchases` (RevenueCat) | Latest | Free until $2,500 MTR. |
| Safe area | `react-native-safe-area-context` | Latest | Required for edge-to-edge Android. |

---

## Claude API Specifics

| Property | Value |
|----------|-------|
| Model ID | `claude-haiku-4-5-20251001` |
| Context window | 200K tokens |
| Input price | $1.00/MTok |
| Output price | $5.00/MTok |
| Cached input price | $0.10/MTok (after cache write) |
| Streaming | Yes — SSE via `stream: true` |

**Cost reality check:**
- Typical session (5 turns, ~2000 tokens total): ~$0.007
- 1,000 sessions/month: ~$7
- 10,000 sessions/month: ~$70

**Memory architecture:**
```
Local AsyncStorage → last 15 message pairs
↓ (on each API call)
Trim to 15 pairs → build messages array
↓
Add system prompt (cached with cache_control: ephemeral)
↓
Send to claude-haiku-4-5
↓
Stream response to UI
↓
Append to local history
```

**Beta Memory Tool** (experimental, Sept 2025):
- Anthropic released persistent cross-session memory beta
- Header: `context-management-2025-06-27`
- TypeScript SDK: `betaMemoryTool`
- Worth evaluating for paid-tier "AI remembers you" feature — could replace manual session history management

---

## Google Play Indonesia Requirements

- **Health declaration form required** for all wellness/journaling apps (enforced Aug 2025)
- **Data Safety section** must declare: mood data, journal text, Anthropic API data sharing
- **Safe language**: use "supports", "helps you reflect", "mindfulness tool" — NOT "treats", "diagnoses", "reduces symptoms"
- **IDR pricing**: Fully supported. Minimum: Rp 3,000. Recommended entry: Rp 25,000/month.
- **RevenueCat** reads IDR pricing from Google Play Console automatically.

---

## Recommended Approach

**Project initialization sequence (do this in order, skip nothing):**

1. `npx create-expo-app@latest reflect --template blank-typescript` (SDK 53)
2. Install `react-native-url-polyfill` → add as FIRST import in entry
3. Add `unstable_enablePackageExports: false` to `metro.config.js`
4. Install Supabase with AsyncStorage adapter
5. Set up EAS project + `eas.json` with development profile
6. Create Firebase project → get FCM V1 service account key → upload to EAS
7. Install NativeWind v4 (pinned) → validate hot reload before proceeding
8. Install Skia using `with-skia` template pattern
9. Install Reanimated (check compat table for SDK 53 exact version)
10. Install RevenueCat
11. Create Supabase project (Singapore region) → enable RLS on all tables
12. Set up EAS Build development build → test on physical Android device

**Design patterns confirmed:**
- Figma Variables (not Styles) → TokenFlow plugin → Style Dictionary → `tailwind.config.js` + `global.css` CSS vars
- NativeWind: set `inlineNativeRem: 16` in metro.config.js to match Figma 16px base
- Expo Router: root Stack → `(auth)` group + `(app)` tabs + `modal/` at root level
- Tabs: Today / Journal / Insights / Profile
- Journal tab: nested Stack for list → detail shared element transition
- Lottie: 3 targeted animations only (breathing loop, checkmark one-shot, confetti celebration)
- Skia: mood graph visualizations, path morphing for mood transitions
- Onboarding: 7 screens, 3 questions, value taste before paywall

---

---

## Design System Specs (Confirmed)

### Color Palette
```css
:root {
  /* Backgrounds */
  --color-bg-primary: oklch(97% 0.01 80);      /* warm off-white */
  --color-surface:    oklch(100% 0 0);           /* pure white cards */

  /* Brand */
  --color-brand-warm: oklch(72% 0.15 45);       /* terracotta/amber — primary CTA */
  --color-brand-calm: oklch(65% 0.10 230);      /* desaturated teal — meditative states */

  /* Mood */
  --color-mood-positive: oklch(78% 0.14 130);  /* soft sage green */
  --color-mood-negative: oklch(72% 0.12 35);   /* muted coral */

  /* Text */
  --color-text-primary: oklch(20% 0.02 260);
  --color-text-muted:   oklch(55% 0.02 260);
}
```

**Rationale:** Terracotta/warm amber = Indonesian cultural resonance (ceramics, batik). No major Indonesian app brand owns this. Avoids Tokopedia orange and GoPay green.

### Typography
- **Primary UI**: Plus Jakarta Sans (geometric, Jakarta cultural origin, excellent Bahasa diacritics)
- **Journal content only**: Lora or DM Serif Display (signals "writing space", premium)
- **Scale**: Display 32/700 · Title 24/600 · Body 16/400 · Caption 13/400
- **Line-height**: 1.6 for all body text (Bahasa Indonesia needs generous spacing)
- **Install via**: Fontsource + `expo-font` (self-hosted, no Google Fonts network dependency)

### Spacing
- Outer screen padding: **24px minimum** (wellness apps need more air than utility apps)
- Card internal padding: **16px uniform**
- Card corner radius: **16px** (rounded-2xl)
- Card shadow: `0 4px 16px rgba(0,0,0,0.10)`

### Lottie Animation Plan
| Animation | File | Size | Trigger |
|-----------|------|------|---------|
| Breathing circle | `breathe-loop.json` | ≤50KB | Loop on meditate screen |
| Checkmark success | `check-done.json` | ≤30KB | One-shot on save |
| Confetti celebration | `confetti.json` | ≤80KB | One-shot on first entry |

Source: lottiefiles.com — filter by Free license. Preload all three in hidden `<LottieView opacity={0}>` on first onboarding screen.

### Onboarding Flow (7 screens)
1. Value prop: *"Mulai refleksi harianmu, rasakan bedanya dalam 7 hari"* + illustration
2. Goal selection: 3 cards (Ketenangan mental / Produktivitas / Tidur lebih baik)
3. Frequency: *"Seberapa sering kamu journaling?"* — 3 options
4. Time preference: Morning / Evening / Both + time picker
5. Personalized plan preview (generated from their 3 answers)
6. **First value taste** — one free interactive journal prompt (highest paywall conversion lever)
7. Paywall: Annual default, monthly secondary, "Coba gratis 7 hari", dismiss = "Nanti saja"

### Expo Router File Structure
```
app/
  _layout.tsx                 // Root Stack — auth redirect + modal host
  (auth)/
    _layout.tsx
    welcome.tsx
    onboarding.tsx
    login.tsx
  (app)/
    _layout.tsx               // Tabs: Today, Journal, Insights, Profile
    today/index.tsx
    journal/
      _layout.tsx             // Nested Stack (enables shared element transitions)
      index.tsx               // Journal list
      [id].tsx                // Entry detail
    insights/index.tsx
    profile/index.tsx
  modal/
    mood-picker.tsx           // presentation: 'modal'
    new-entry.tsx             // presentation: 'fullScreenModal'
    settings.tsx
```

---

## Constraints Discovered
- Expo Go is effectively deprecated for real development — EAS dev builds are the new baseline
- RevenueCat is free for MVP phase (under $2,500/month) — include from day 1
- Prompt caching on Claude system prompt must be implemented — otherwise costs are 10x higher
- Google Play health declaration form is mandatory for this app category (not optional)
- Indonesia PDP Law 2024: Anthropic API data sharing must be disclosed in Data Safety section
- `.lottie` compressed format has Android SDK 53 rendering bug — use `.json` format for all Lottie files
- NativeWind: must set `inlineNativeRem: 16` otherwise all sizes are ~12.5% smaller than Figma tokens
- Figma blend modes / background blur = NO React Native equivalent — establish NO_RN_EXPORT constraint in Figma
- Shared element transitions: only reliable for same-level stack navigation (list→detail), not across nested stacks
- Plus Jakarta Sans must be self-hosted via Fontsource + expo-font (not runtime Google Fonts fetch)
