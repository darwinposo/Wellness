import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from './supabase';

// Required for iOS to properly close the auth browser session
WebBrowser.maybeCompleteAuthSession();

/**
 * Signs in with Google OAuth via Supabase + expo-web-browser.
 *
 * Unified flow: works for both new and returning users.
 * - New user  → ensureProfile() creates their profile row
 * - Returning → ensureProfile() is a no-op (profile exists)
 *
 * IMPORTANT: On Android, openAuthSessionAsync CONSUMES the redirect intent.
 * The deep link is NOT delivered to Linking/Expo Router, so callback.tsx
 * never opens for Google OAuth. This function MUST exchange the code itself.
 * (callback.tsx exists only for email verification deep links.)
 *
 * LANDMINE: OAuth requires EAS dev build or physical device — Expo Go won't work.
 *
 * @throws Error if Supabase OAuth initialization or code exchange fails
 */
export async function signInWithGoogle(): Promise<void> {
  const redirectUri = makeRedirectUri({ scheme: 'reflect', path: 'auth/callback' });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true, // We handle the browser ourselves via expo-web-browser
    },
  });

  if (error) throw error;

  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type === 'success') {
      // Handle both PKCE (code in query params) and implicit grant (tokens in fragment).
      // Supabase may return either depending on project settings.
      const codeMatch = result.url.match(/[?&]code=([^&#]+)/);
      const fragmentMatch = result.url.match(/#(.+)/);

      if (codeMatch?.[1]) {
        // PKCE flow: exchange code for session
        const code = decodeURIComponent(codeMatch[1]);
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;
      } else if (fragmentMatch) {
        // Implicit grant flow: tokens are already in the URL fragment
        const params = new URLSearchParams(fragmentMatch[1]);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        if (!accessToken || !refreshToken) {
          throw new Error('Missing tokens in OAuth response');
        }
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) throw sessionError;
      } else {
        throw new Error('Unrecognized OAuth redirect URL format');
      }

      // Create profile if needed (idempotent — safe for new + returning users)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          await ensureProfile(user.id, user.email ?? '');
        } catch {
          // Non-fatal: profile can be created/updated during onboarding
        }
      }

      // Session is now set → onAuthStateChange fires → _layout.tsx navigates
    }
    // If result.type is 'cancel' or 'dismiss', user cancelled — do nothing
  }
}

/**
 * Registers a new user with email and password via Supabase.
 * After sign-up, user must verify their email before they can log in.
 *
 * @throws Error if Supabase signUp fails (e.g. email already in use)
 */
export async function signUpWithEmail(email: string, password: string): Promise<void> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  // Supabase returns a fake success for existing emails to prevent enumeration.
  // Detect it: identities array is empty when the email is already registered.
  if (data.user && (data.user.identities?.length ?? 1) === 0) {
    throw new Error('email_already_registered');
  }
}

/**
 * Signs in an existing user with email and password via Supabase.
 * After sign-in, onAuthStateChange in _layout.tsx fires and navigates automatically.
 *
 * @throws Error if credentials are invalid or email is not confirmed
 */
export async function signInWithEmail(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/**
 * Sends a password reset email via Supabase.
 * The email contains a link that deep-links back to reflect://auth/callback?type=recovery.
 * callback.tsx detects type=recovery and navigates to /auth/reset-password.
 *
 * @throws Error if Supabase fails to send the email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  const redirectUri = makeRedirectUri({ scheme: 'reflect', path: 'auth/callback' });
  // Embed type=recovery so Supabase preserves it in the redirect alongside the PKCE code.
  // PKCE flow produces: reflect://auth/callback?type=recovery&code=xxx
  // callback.tsx reads params.type === 'recovery' to route to the reset-password screen.
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectUri}?type=recovery`,
  });
  if (error) throw error;
}

/**
 * Signs out the current user from Supabase.
 * After sign-out, onAuthStateChange in _layout.tsx fires and
 * redirects to /auth/login automatically.
 *
 * @throws Error if Supabase signOut fails
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Ensures a profile row exists for the authenticated user.
 * Called after Google OAuth — idempotent, safe to call multiple times.
 * - New user: inserts profile with onboarding preferences
 * - Returning user: finds existing profile and returns (no-op)
 *
 * @param userId - Supabase auth user ID (UUID)
 * @param email - User's email
 */
export async function ensureProfile(userId: string, email: string): Promise<void> {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (existing) return; // Profile already exists — no duplicate insert

  // First login via Google: create minimal profile.
  // goal/frequency/time_preference left null — populated after onboarding completes.
  const { error: insertError } = await supabase.from('profiles').insert({
    id: userId,
    email,
    is_premium: false,
  });
  if (insertError) throw insertError;
}
