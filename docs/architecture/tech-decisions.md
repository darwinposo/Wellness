# Technical Decisions Log — Reflect
Auto-updated by GSD Research Phase

---

## [Pre-M001] — Foundational Stack — 2026-03-11

### Libraries Confirmed

| Library | Version | Reason |
|---------|---------|--------|
| expo | SDK 53 | Latest stable, New Architecture default |
| react-native-reanimated | ~3.16.7 | Native-thread animations, required for Skia |
| @shopify/react-native-skia | SDK 53 compat | GPU-accelerated mood visualizations |
| nativewind | 4.1.x (pinned) | Tailwind-style styling for React Native |
| lottie-react-native | Latest | Micro-animations (celebrations, transitions) |
| @supabase/supabase-js | 2.x | Backend + auth + database |
| @anthropic-ai/sdk | Latest | claude-haiku-4-5-20251001 AI companion |
| react-native-purchases | Latest | RevenueCat — IAP subscriptions |
| expo-notifications | SDK 53 | Push notifications (EAS + FCM V1) |
| expo-router | v3 | File-based navigation |
| react-native-url-polyfill | Latest | Required for Supabase URL parsing |
| @react-native-async-storage/async-storage | Latest | Supabase auth storage (NOT SecureStore) |
| react-native-safe-area-context | Latest | Edge-to-edge Android layout |

### Patterns Established

- **Metro config**: `unstable_enablePackageExports: false` required for Supabase + SDK 53
- **Supabase auth storage**: AsyncStorage adapter (SecureStore 2048-byte limit workaround)
- **RLS pattern**: Always `USING ((SELECT auth.uid()) = user_id)` with index on `user_id`
- **Claude memory**: Sliding window of last 15 message pairs, local AsyncStorage persistence
- **Claude cost optimization**: System prompt with `cache_control: ephemeral` — $0.10/MTok vs $1.00/MTok
- **IAP**: RevenueCat free tier covers full MVP phase ($0 until $2,500 MTR)
- **Push**: EAS Build required from day 1 — Expo Go does not support push on Android (SDK 53+)
