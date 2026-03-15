/**
 * tests/lib/auth-signout.test.ts
 * Tests for signOut function in src/lib/auth.ts
 */

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
      signInWithOAuth: jest.fn(),
      exchangeCodeForSession: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(),
  },
}));

jest.mock('@/store/onboarding', () => ({
  useOnboardingStore: {
    getState: jest.fn(() => ({
      goal: 'stress',
      frequency: 'daily',
      timePreference: 'morning',
    })),
  },
}));

import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';

const mockSignOut = jest.mocked(supabase.auth.signOut);

describe('signOut', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls supabase.auth.signOut', async () => {
    mockSignOut.mockResolvedValue({ error: null } as any);
    await signOut();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('resolves without throwing on success', async () => {
    mockSignOut.mockResolvedValue({ error: null } as any);
    await expect(signOut()).resolves.not.toThrow();
  });

  it('throws when supabase signOut returns an error', async () => {
    mockSignOut.mockResolvedValue({ error: new Error('Sign out failed') } as any);
    await expect(signOut()).rejects.toThrow('Sign out failed');
  });
});
