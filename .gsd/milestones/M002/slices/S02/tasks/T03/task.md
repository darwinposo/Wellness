# T03: Onboarding State + Completion Flow
Slice: M002/S02
Created: 2026-03-12

## Goal
Wire the onboarding completion to the app root — so returning users skip onboarding, first-time users go through it, and the transition to the main app (after auth) is seamless. Includes the root layout auth guard.

## Steps
1. Update `src/app/_layout.tsx` — check onboarding + auth state, redirect accordingly
2. Create `src/hooks/useAuth.ts` — Supabase session + auth state hook
3. Update root layout to handle 3 cases: first launch → onboarding, no auth → login, authed → tabs
4. Add `BackHandler` on Screen 1 to prevent going back from first onboarding screen
5. Test full flow: first launch → onboarding → login → home → restart → home (no onboarding)

## Must-Haves

### Truths
- [ ] First launch: app shows onboarding Screen 1 (not tabs)
- [ ] Returning user with session: app shows tabs directly (skips onboarding)
- [ ] Completing paywall → navigating to login → signing in → tabs (onboarding never shown again)
- [ ] Hardware back on Screen 1 does NOT exit onboarding (BackHandler prevents it)
- [ ] Session persists across full app restarts (kill + reopen)

### Artifacts
- [ ] `src/app/_layout.tsx` — updated with onboarding + auth routing logic
- [ ] `src/hooks/useAuth.ts` — exists, exports `useAuth` hook
- [ ] `src/store/auth.ts` — exists, Zustand auth store

### Key Links
- [ ] `_layout.tsx` reads `useOnboardingStore().isComplete` to gate routing
- [ ] `_layout.tsx` reads `useAuth().session` to gate auth routing
- [ ] `useAuth.ts` subscribes to `supabase.auth.onAuthStateChange`

## Root Layout Routing Logic
```tsx
// src/app/_layout.tsx routing decision
const { isComplete } = useOnboardingStore();
const { session, loading } = useAuth();

if (loading) return <SplashScreen />;
if (!isComplete) return <Redirect href="/onboarding" />;
if (!session) return <Redirect href="/auth/login" />;
return <Slot />; // → tabs
```

## useAuth Hook Template
```ts
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
}
```

## Notes
- `useOnboardingStore().isComplete` is set to `true` in the paywall screen when user taps either CTA
- Do NOT call `complete()` until user reaches the paywall — partial onboarding = start over
- Loading state: show splash/spinner while checking session to avoid flash of wrong screen
- This task has no new screens — it's all wiring and state logic
