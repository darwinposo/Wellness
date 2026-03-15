import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';
import { ensureProfile } from '@/lib/auth';
import { useAuthStore } from '@/store/auth';
import { COLORS, FONTS } from '@/lib/constants';
import { useOnboardingStore } from '@/store/onboarding';

/**
 * OAuth + email verification callback screen.
 *
 * Handles two URL shapes from Supabase:
 *   1. Google OAuth (PKCE)  — ?code=xxx
 *   2. Email verification   — ?token_hash=xxx&type=signup
 *
 * For Google OAuth on Android:
 *   signInWithGoogle() already exchanges the code and sets the session.
 *   Linking then delivers the same URL here (Android double-delivery).
 *   We detect the existing session and ONLY call ensureProfile + navigate.
 *   ensureProfile errors are swallowed — auth is already confirmed, profile
 *   can be retried; we must NOT kick the user back to login just because
 *   profile creation failed.
 *
 * For email verification:
 *   No prior session. We verify the OTP token and establish a session here.
 */
export default function AuthCallbackScreen() {
  const url = Linking.useURL();
  const params = useLocalSearchParams<{
    code?: string;
    token_hash?: string;
    type?: string;
    error?: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    // Hard timeout: if deep link never arrives or processing hangs,
    // escape the spinner after 10 seconds instead of blocking forever
    const timeout = setTimeout(async () => {
      // Sign out to clear any partial recovery session before returning to login
      await supabase.auth.signOut().catch(() => {});
      router.replace('/auth/login' as any);
    }, 10_000);

    async function handleCallback() {
      // Nothing to process yet — wait for URL/params
      if (!url && !params.code && !params.token_hash) return;
      clearTimeout(timeout);

      if (params.error) {
        router.replace('/auth/login' as any);
        return;
      }

      // Supabase may send `type` in the URL hash fragment (implicit flow) rather than
      // as a query param. Parse it out so recovery links work in both flows.
      let effectiveType = params.type;
      if (!effectiveType && url) {
        const hashMatch = url.match(/[#&]type=([^&]+)/);
        if (hashMatch) effectiveType = decodeURIComponent(hashMatch[1]);
      }

      try {
        // Whitelist allowed OTP types — reject anything unexpected
        const ALLOWED_OTP_TYPES = ['signup', 'recovery', 'email', 'invite', 'magiclink', 'email_change'] as const;
        type AllowedOtpType = typeof ALLOWED_OTP_TYPES[number];
        const isAllowedType = (t: string | undefined): t is AllowedOtpType =>
          ALLOWED_OTP_TYPES.includes(t as AllowedOtpType);

        // Validate token_hash format — must be a hex string (Supabase tokens are hex)
        const isValidTokenHash = (h: string | undefined): boolean =>
          typeof h === 'string' && /^[0-9a-f]{40,}$/i.test(h);

        // Check if session is already established (e.g. returning user with persisted session)
        const { data: { session: existing } } = await supabase.auth.getSession();

        if (!existing) {
          // No session yet — establish one from the URL

          let authError: any = null;

          if (params.token_hash && params.type) {
            // Reject malformed or unexpected params before calling Supabase
            if (!isAllowedType(params.type) || !isValidTokenHash(params.token_hash)) {
              router.replace('/auth/login' as any);
              return;
            }
            const { error } = await supabase.auth.verifyOtp({
              token_hash: params.token_hash,
              type: params.type,
            });
            authError = error;
          } else if (params.code) {
            // OAuth PKCE code flow — extract just the code, not full URL
            const { error } = await supabase.auth.exchangeCodeForSession(params.code);
            authError = error;
          }
          // Implicit flow (hash fragment): Supabase JS auto-parses and sets the session
          // via onAuthStateChange — no manual exchange needed here.

          if (authError) {
            router.replace('/auth/login' as any);
            return;
          }
        }

        // Password recovery flow — set flag then navigate to reset password screen.
        // Check effectiveType (covers both query-param and hash-fragment delivery).
        if (effectiveType === 'recovery') {
          useAuthStore.getState().setRecoverySession(true);
          router.replace('/auth/reset-password' as any);
          return;
        }

        // Confirm user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/auth/login' as any);
          return;
        }

        // Create profile if needed — swallow errors so auth failures here
        // don't kick an already-authenticated user back to login
        try {
          await ensureProfile(user.id, user.email ?? '');
        } catch {
          // Profile creation failed (DB schema / network) — non-fatal.
          // User is authenticated; profile will be created/updated in onboarding.
        }

        // Navigate based on onboarding completion
        const { isComplete } = useOnboardingStore.getState();
        if (isComplete) {
          router.replace('/(tabs)' as any);
        } else {
          router.replace('/onboarding' as any);
        }

      } catch {
        // Only fatal errors (session exchange failures) reach here
        router.replace('/auth/login' as any);
      }
    }

    handleCallback();
    return () => clearTimeout(timeout);
  }, [url, params.code, params.token_hash, params.type, params.error]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgPrimary }}>
      <ActivityIndicator size="large" color={COLORS.brandPrimary} />
      <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: COLORS.textMuted, marginTop: 16 }}>
        Menyelesaikan proses masuk...
      </Text>
    </View>
  );
}

function buildUrlFromParams(params: Record<string, string | string[] | undefined>): string | null {
  const hasParams = Object.values(params).some(v => v !== undefined);
  if (!hasParams) return null;
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  return `reflect://auth/callback?${query}`;
}
