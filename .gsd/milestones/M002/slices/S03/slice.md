# S03: Authentication
Milestone: M002
Created: 2026-03-12
Iteration: 1

## Demo Sentence
After this slice, the user can sign in with Google, have their session persist across app restarts, and land on the Today/Home screen as an authenticated user — and signing out returns them to the login screen.

## Boundary Map

### Produces
- `src/app/auth/login.tsx` → Google OAuth login screen
- `src/lib/supabase.ts` → updated: Google OAuth sign-in function
- `src/store/auth.ts` → exports: `useAuthStore`, `AuthState`
- Supabase project: `profiles` table with RLS enabled

### Consumes
- From S01: `supabase` client, `SafeScreen`, `Button`, `Card`
- From S02: onboarding completion state (routes user past login)

## Tasks
- T01: Supabase project setup + profiles table + RLS
- T02: Google OAuth login screen + expo-auth-session
- T03: Session persistence + protected route + sign-out

## Must-Haves (Slice Level)

### Truths
- [ ] Tapping "Lanjut dengan Google" opens Google OAuth sheet
- [ ] Successful Google auth → user arrives at Today tab
- [ ] `profiles` table created in Supabase with RLS enabled
- [ ] Session persists after full app kill + reopen
- [ ] Sign out from Profile tab → returns to login screen
- [ ] Auth errors shown as user-friendly Indonesian toast

### Artifacts
- [ ] `src/app/auth/login.tsx` — full login screen with Google button
- [ ] Supabase: `profiles` table with `id`, `email`, `goal`, `frequency`, `time_preference`, `is_premium`, `created_at`
- [ ] Supabase: RLS policy on `profiles` — user can only read/write own row
- [ ] `.env` — `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` set

### Key Links
- [ ] Login screen Google button calls `supabase.auth.signInWithOAuth`
- [ ] After auth, `onAuthStateChange` fires → `_layout.tsx` redirects to tabs
- [ ] Profile screen has sign-out button calling `supabase.auth.signOut`
