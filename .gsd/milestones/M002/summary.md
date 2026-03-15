# M002 Summary: App Foundation
Completed: 2026-03-15
Slices: S01 (Project Scaffold), S02 (Onboarding Flow), S03 (Authentication)

## What Was Built
A production-ready React Native + Expo app foundation: full project scaffold with all 8 landmines
neutralized, 7-screen Indonesian onboarding flow with persistent Zustand state, and complete
authentication system (Google OAuth + email/password + password reset via secure deep link).
The app runs on Android via EAS dev build, connects to Supabase, persists sessions, and ships
all UI in warm casual Bahasa Indonesia. 100 tests passing.

## Milestone Demo
A new user opens the app → completes 7 onboarding screens → registers with email or Google →
session persists after app kill → if they forget their password, resets it via email deep link →
profile tab shows their email → sign out returns to login. Everything in Indonesian.

## Slices Completed

| Slice | Title | Date | Key Contribution |
|-------|-------|------|-----------------|
| S01 | Project Scaffold | 2026-03-12 | Expo SDK 55, EAS, NativeWind, 8 landmines neutralized |
| S02 | Onboarding Flow | 2026-03-13 | 7 screens, Zustand + AsyncStorage persistence, routing |
| S03 | Authentication | 2026-03-15 | Google OAuth, email auth, password reset, 100 tests |

## Architectural Decisions Locked

1. **Expo SDK 55 + EAS Build** — No Expo Go for anything requiring native modules (OAuth, etc.)
2. **Supabase PKCE flow** — `flowType: 'pkce'` required for Google OAuth; affects all deep link handling
3. **Auth-first routing** — `_layout.tsx` is the single routing authority; screens never navigate after auth events
4. **AsyncStorage for session** — SecureStore silently fails with Supabase JWTs (>2048 bytes); AsyncStorage only
5. **Bahasa Indonesia throughout** — all copy, error messages, alerts in Indonesian; no English fallback for users

## Patterns Established (all M003+ work should follow)

- **SafeScreen wrapper**: every screen uses `<SafeScreen>` — never raw `<View>`
- **Auth navigation = `_layout.tsx`**: screens call auth functions, layout handles routing
- **RLS on every table**: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` — non-negotiable
- **PKCE recovery redirect**: append `?type=recovery` to `redirectTo` in `resetPasswordForEmail`
- **Deferred sign-out**: `signOut` inside Alert `onPress`, not before
- **Nested Text for inline links**: `<Text onPress>` inside `<Text>` — no `TouchableOpacity` in flex rows
- **Jest mock supabase module**: never import `supabase.ts` directly in tests
- **npm installs**: always `--legacy-peer-deps`

## What M003 Should Know

### Available APIs
- `supabase` client at `src/lib/supabase.ts` — already configured (PKCE, AsyncStorage, Singapore)
- `useAuthStore()` from `src/store/auth.ts` — gives `session.user.id` for authenticated user
- `ensureProfile(userId, email)` — idempotent, safe to call anywhere

### Database
- `profiles` table: `id` (FK → auth.users), `email`, `goal`, `frequency`, `time_preference`, `is_premium`, `created_at`
- RLS enabled: all queries auto-scoped to authenticated user
- For new tables: always `ALTER TABLE <name> ENABLE ROW LEVEL SECURITY` + create SELECT/INSERT/UPDATE policy

### Key Constraints
- `unstable_enablePackageExports: false` in `metro.config.js` — must stay (Supabase landmine)
- `flowType: 'pkce'` — do not change
- Plus Jakarta Sans via `fontFamily` style prop (NativeWind doesn't map fonts)
- 24px outer padding (`paddingHorizontal: 24`) on all screens
