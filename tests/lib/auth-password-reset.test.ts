/**
 * tests/lib/auth-password-reset.test.ts
 * Tests for sendPasswordReset() in src/lib/auth.ts
 *
 * Flow: user enters email → sendPasswordReset() calls supabase.auth.resetPasswordForEmail
 * with a deep-link redirect → Supabase sends email with recovery link →
 * user taps link → callback.tsx handles type=recovery → navigates to reset-password screen
 */

// ---- Mocks (hoisted before imports) ----------------------------------------

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  openAuthSessionAsync: jest.fn(),
}));

jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'reflect://auth/callback'),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: jest.fn(),
      signInWithOAuth: jest.fn(),
      exchangeCodeForSession: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
    from: jest.fn(),
  },
}));

// ---- Imports (setelah mocks) ------------------------------------------------

import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '@/lib/supabase';
import { sendPasswordReset } from '@/lib/auth';

const mockResetPasswordForEmail = jest.mocked(supabase.auth.resetPasswordForEmail);
const mockMakeRedirectUri = jest.mocked(makeRedirectUri);

// ---- Tests ------------------------------------------------------------------

describe('sendPasswordReset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default redirect URI sesuai scheme Reflect
    mockMakeRedirectUri.mockReturnValue('reflect://auth/callback');
  });

  it('calls supabase.auth.resetPasswordForEmail with the provided email', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ data: {}, error: null } as any);

    await sendPasswordReset('pengguna@example.com');

    expect(mockResetPasswordForEmail).toHaveBeenCalledTimes(1);
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
      'pengguna@example.com',
      expect.objectContaining({ redirectTo: expect.any(String) })
    );
  });

  it('passes redirectTo option with the correct redirect URI (reflect://auth/callback)', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ data: {}, error: null } as any);

    await sendPasswordReset('pengguna@example.com');

    // makeRedirectUri dikonfigurasi dengan scheme 'reflect' dan path 'auth/callback'
    expect(mockMakeRedirectUri).toHaveBeenCalledWith(
      expect.objectContaining({ scheme: 'reflect', path: 'auth/callback' })
    );
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
      expect.any(String),
      // type=recovery appended so PKCE flow preserves it alongside ?code=xxx
      expect.objectContaining({ redirectTo: 'reflect://auth/callback?type=recovery' })
    );
  });

  it('resolves without throwing on success', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ data: {}, error: null } as any);

    await expect(sendPasswordReset('pengguna@example.com')).resolves.not.toThrow();
  });

  it('throws when supabase returns an error', async () => {
    const supabaseError = new Error('Gagal mengirim email reset kata sandi');
    mockResetPasswordForEmail.mockResolvedValue({ data: {}, error: supabaseError } as any);

    await expect(sendPasswordReset('pengguna@example.com')).rejects.toThrow(
      'Gagal mengirim email reset kata sandi'
    );
  });

  it('throws when email is empty string (supabase returns error)', async () => {
    // Supabase menolak email kosong dan mengembalikan error
    const emptyEmailError = new Error('Email address is required');
    mockResetPasswordForEmail.mockResolvedValue({ data: {}, error: emptyEmailError } as any);

    await expect(sendPasswordReset('')).rejects.toThrow('Email address is required');
  });
});
