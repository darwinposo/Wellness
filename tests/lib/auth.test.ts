/**
 * tests/lib/auth.test.ts
 * Tests for the auth helper: signInWithGoogle + ensureProfile
 */

// ---- Mocks ----------------------------------------------------------------
// Note: jest.mock() factories are hoisted — cannot reference outer `const` vars.
// Use jest.mocked() + import to get typed access to mocked functions.

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
      setSession: jest.fn(),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'u1', email: 'a@b.com' } } }),
    },
    from: jest.fn(),
  },
}));

// onboarding store mock no longer needed — ensureProfile no longer reads it

// ---- Imports (after mocks) -------------------------------------------------

import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';
import { signInWithGoogle, signUpWithEmail, signInWithEmail, ensureProfile } from '@/lib/auth';

const mockSignInWithOAuth = jest.mocked(supabase.auth.signInWithOAuth);
const mockExchangeCodeForSession = jest.mocked(supabase.auth.exchangeCodeForSession);
const mockSetSession = jest.mocked(supabase.auth.setSession);
const mockSignUp = jest.mocked(supabase.auth.signUp);
const mockSignInWithPassword = jest.mocked(supabase.auth.signInWithPassword);
const mockFrom = jest.mocked(supabase.from);

// ---- Tests -----------------------------------------------------------------

describe('signInWithGoogle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls supabase.auth.signInWithOAuth with google provider', async () => {
    mockSignInWithOAuth.mockResolvedValue({ data: null, error: null } as any);
    await signInWithGoogle();
    expect(mockSignInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'google' })
    );
  });

  it('PKCE flow: extracts code and calls exchangeCodeForSession', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://accounts.google.com/o/oauth2/...' },
      error: null,
    } as any);
    (WebBrowser.openAuthSessionAsync as jest.Mock).mockResolvedValue({
      type: 'success',
      url: 'reflect://auth/callback?code=abc123',
    });
    mockExchangeCodeForSession.mockResolvedValue({ data: {}, error: null } as any);
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'u1' } }),
    } as any);

    await signInWithGoogle();

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('abc123');
    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it('implicit grant flow: extracts tokens from fragment and calls setSession', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://accounts.google.com/o/oauth2/...' },
      error: null,
    } as any);
    (WebBrowser.openAuthSessionAsync as jest.Mock).mockResolvedValue({
      type: 'success',
      url: 'reflect://auth/callback#access_token=tok123&refresh_token=ref456&token_type=bearer',
    });
    mockSetSession.mockResolvedValue({ data: {}, error: null } as any);
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'u1' } }),
    } as any);

    await signInWithGoogle();

    expect(mockSetSession).toHaveBeenCalledWith({
      access_token: 'tok123',
      refresh_token: 'ref456',
    });
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
  });

  it('does NOT exchange code when WebBrowser is dismissed/cancelled', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://accounts.google.com/...' },
      error: null,
    } as any);
    (WebBrowser.openAuthSessionAsync as jest.Mock).mockResolvedValue({
      type: 'cancel',
    });

    await signInWithGoogle();

    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
  });

  it('throws when supabase returns an error', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: null,
      error: new Error('OAuth init failed'),
    } as any);

    await expect(signInWithGoogle()).rejects.toThrow('OAuth init failed');
  });
});

describe('signUpWithEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls supabase.auth.signUp with email and password', async () => {
    mockSignUp.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null } as any);
    await signUpWithEmail('user@test.com', 'password123');
    expect(mockSignUp).toHaveBeenCalledWith({ email: 'user@test.com', password: 'password123' });
  });

  it('resolves without throwing on success', async () => {
    mockSignUp.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null } as any);
    await expect(signUpWithEmail('user@test.com', 'password123')).resolves.not.toThrow();
  });

  it('throws when supabase returns an error', async () => {
    mockSignUp.mockResolvedValue({ data: null, error: new Error('Email already in use') } as any);
    await expect(signUpWithEmail('user@test.com', 'password123')).rejects.toThrow('Email already in use');
  });
});

describe('signInWithEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls supabase.auth.signInWithPassword with email and password', async () => {
    mockSignInWithPassword.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null } as any);
    await signInWithEmail('user@test.com', 'password123');
    expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: 'user@test.com', password: 'password123' });
  });

  it('resolves without throwing on success', async () => {
    mockSignInWithPassword.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null } as any);
    await expect(signInWithEmail('user@test.com', 'password123')).resolves.not.toThrow();
  });

  it('throws when credentials are invalid', async () => {
    mockSignInWithPassword.mockResolvedValue({ data: null, error: new Error('Invalid credentials') } as any);
    await expect(signInWithEmail('user@test.com', 'wrongpass')).rejects.toThrow('Invalid credentials');
  });
});

describe('ensureProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does NOT insert if profile already exists', async () => {
    const mockInsert = jest.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'user-1' }, error: null }),
      insert: mockInsert,
    } as any);

    await ensureProfile('user-1', 'user@test.com');

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('inserts profile on first login when no existing row', async () => {
    const mockInsert = jest.fn().mockResolvedValue({ error: null });

    mockFrom
      .mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      } as any)
      .mockReturnValueOnce({ insert: mockInsert } as any);

    await ensureProfile('user-1', 'user@test.com');

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'user-1',
        email: 'user@test.com',
        is_premium: false,
      })
    );
    // goal/frequency/time_preference are NOT set at registration —
    // they're populated after onboarding completes
  });
});
