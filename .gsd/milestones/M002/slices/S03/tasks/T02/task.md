# T02: Google OAuth Login Screen
Slice: M002/S03
Created: 2026-03-12

## Goal
Build the login screen with the official Google sign-in button and wire it to Supabase Google OAuth via expo-auth-session. Successful auth creates a profile row and navigates to tabs.

## Steps
1. Install expo-auth-session: `npx expo install expo-auth-session expo-crypto`
2. Add redirect URI scheme to `app.json`: `reflect`
3. Create `src/app/auth/login.tsx` — login screen UI
4. Implement `signInWithGoogle()` using Supabase OAuth + expo-auth-session
5. On auth success: create profile row in Supabase (if first login)
6. Handle auth errors: show Indonesian error toast
7. Test on physical Android device (OAuth requires real device or EAS build)

## Must-Haves

### Truths
- [ ] Tapping Google button opens Google account picker
- [ ] Selecting account → auth completes → user arrives at Today tab
- [ ] If user already has profile, no duplicate row created
- [ ] Auth error (network, cancelled) shows toast in Bahasa Indonesia
- [ ] Login screen does NOT show back button (cannot go back past login)

### Artifacts
- [ ] `src/app/auth/login.tsx` — full login screen, ≥60 lines
- [ ] Google button uses official brand colors (white bg, #dadce0 border, multicolor G icon)
- [ ] `src/lib/auth.ts` — exports `signInWithGoogle()` function

### Key Links
- [ ] `signInWithGoogle` calls `supabase.auth.signInWithOAuth({ provider: 'google' })`
- [ ] After sign-in, `onAuthStateChange` in root layout triggers navigation to tabs
- [ ] `login.tsx` uses `SafeScreen` wrapper

## Screen Copy (Bahasa Indonesia)
```
Logo:     Reflect wordmark (Plus Jakarta Sans SemiBold, brand/primary)
Headline: "Selamat datang kembali"
Subtext:  "Masuk untuk melanjutkan perjalananmu."
Button:   "Lanjut dengan Google"
Footer:   "Dengan masuk, kamu setuju dengan Syarat & Ketentuan dan Kebijakan Privasi kami."
```

## Google OAuth Implementation
```ts
// src/lib/auth.ts
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const redirectUri = makeRedirectUri({ scheme: 'reflect', path: 'auth/callback' });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;

  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
    if (result.type === 'success') {
      const { url } = result;
      await supabase.auth.exchangeCodeForSession(url);
    }
  }
}
```

## Profile Creation on First Login
```ts
// Call after successful auth — creates profile row if not exists
async function ensureProfile(userId: string, email: string) {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!data) {
    const { goal, frequency, timePreference } = useOnboardingStore.getState();
    await supabase.from('profiles').insert({
      id: userId,
      email,
      goal,
      frequency,
      time_preference: timePreference,
      is_premium: false,
    });
  }
}
```

## Notes
- `expo-web-browser` required for OAuth web flow on Android
- OAuth testing REQUIRES physical device or EAS dev build — Expo Go won't work (Landmine 5)
- The redirect URI must exactly match what's registered in Google Cloud Console
- Install expo-web-browser: `npx expo install expo-web-browser`
