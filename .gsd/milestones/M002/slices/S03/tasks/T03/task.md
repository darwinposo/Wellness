# T03: Session Persistence + Protected Routes + Sign Out
Slice: M002/S03
Created: 2026-03-12

## Goal
Ensure auth session survives app restarts, protected tabs are unreachable without auth, sign-out works from the Profile tab, and the full user journey (onboarding → auth → home → restart → home) is verified end to end.

## Steps
1. Verify `supabase.auth.getSession()` restores session on app start (already in useAuth hook)
2. Update Profile stub screen with sign-out button
3. Implement `signOut()` function
4. Add auth guard: unauthenticated access to tabs redirects to login
5. Test full flow on physical device:
   - Fresh install → onboarding → login → home
   - Kill app → reopen → home (no onboarding, no login)
   - Sign out → login screen
   - Sign in again → home

## Must-Haves

### Truths
- [ ] Killing and reopening the app lands authed user on Today tab (no re-auth)
- [ ] Unauthenticated attempt to access tabs redirects to login
- [ ] Sign out from Profile tab → clears session → shows login screen
- [ ] AsyncStorage session key exists after login (verifiable via Reactotron or logs)

### Artifacts
- [ ] `src/app/(tabs)/profile.tsx` — updated with sign-out button
- [ ] `src/lib/auth.ts` — exports `signOut()` function
- [ ] `src/app/_layout.tsx` — auth guard routing complete

### Key Links
- [ ] Profile screen calls `signOut()` from `src/lib/auth.ts`
- [ ] `signOut()` calls `supabase.auth.signOut()` + resets auth store
- [ ] Root layout `useAuth` hook properly handles `loading` state (no flicker)

## Sign Out Implementation
```ts
// src/lib/auth.ts (add to existing file)
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  // onAuthStateChange fires automatically → _layout.tsx redirects to login
}
```

## Profile Screen with Sign Out
```tsx
// src/app/(tabs)/profile.tsx (stub with sign out)
import { View, Text } from 'react-native';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { signOut } from '@/lib/auth';

export default function ProfileScreen() {
  async function handleSignOut() {
    try {
      await signOut();
    } catch (e) {
      // Show toast: "Gagal keluar. Coba lagi."
    }
  }

  return (
    <SafeScreen className="px-6 justify-between pb-8">
      <Text className="text-2xl font-bold text-text-primary mt-8">Profil</Text>
      <Button
        label="Keluar"
        variant="ghost"
        onPress={handleSignOut}
      />
    </SafeScreen>
  );
}
```

## End-to-End Test Checklist
```
[ ] Fresh install: opens to Onboarding Screen 1
[ ] Complete onboarding → paywall → tap "Mulai Gratis" → login screen
[ ] Tap "Lanjut dengan Google" → Google picker → select account → Today tab
[ ] Kill app → reopen → Today tab (no onboarding, no login)
[ ] Profile tab → "Keluar" → login screen
[ ] Tap Google again → Today tab (profile already exists, no duplicate)
```

## Notes
- Loading state in root layout prevents flicker — always show splash until session check resolves
- AsyncStorage key for Supabase session: `sb-<project-ref>-auth-token` (auto-set by Supabase)
- If session expires (7 days default): `autoRefreshToken: true` in supabase client handles renewal
- This task completes M002/S03 — next is M002 VERIFY then SUMMARIZE
