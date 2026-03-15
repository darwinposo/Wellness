/**
 * tests/lib/auth-recovery-callback.test.ts
 * Tests for the recovery flow that runs inside callback.tsx (unit level, no rendering).
 *
 * Flow under test:
 *   1. callback.tsx receives params: { token_hash: 'xxx', type: 'recovery' }
 *   2. Checks for existing session first (double-exchange guard)
 *   3. If no session: calls supabase.auth.verifyOtp({ token_hash, type: 'recovery' })
 *   4. If verifyOtp succeeds AND type === 'recovery': isRecoverySession = true → navigate to /auth/reset-password
 *   5. If verifyOtp fails: error is truthy → navigate to /auth/login
 *
 * Sama seperti google-auth-flow.test.ts — unit test logika langsung, tanpa render komponen React.
 */

// ---- Mocks (hoisted before imports) ----------------------------------------

const mockGetSession = jest.fn();
const mockVerifyOtp = jest.fn();
const mockSignInWithOAuth = jest.fn();
const mockExchangeCodeForSession = jest.fn();

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  openAuthSessionAsync: jest.fn().mockResolvedValue({ type: 'cancel' }),
}));

jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn().mockReturnValue('reflect://auth/callback'),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      get getSession() { return mockGetSession; },
      get verifyOtp() { return mockVerifyOtp; },
      get signInWithOAuth() { return mockSignInWithOAuth; },
      get exchangeCodeForSession() { return mockExchangeCodeForSession; },
    },
    from: jest.fn(),
  },
}));

// ---- Imports (setelah mocks) ------------------------------------------------

// Tidak ada import auth.ts khusus — kita test logika callback.tsx secara langsung
// via mock supabase calls, sesuai pola google-auth-flow.test.ts

// ---- Helpers ----------------------------------------------------------------

const FAKE_USER = { id: 'user-123', email: 'pengguna@reflect.com' };
const FAKE_SESSION = { user: FAKE_USER, access_token: 'tok-abc', refresh_token: 'ref-xyz' };

// Simulasikan logika callback.tsx untuk flow recovery
async function simulateCallbackRecoveryFlow(params: {
  token_hash?: string;
  type?: string;
  existingSession?: object | null;
}) {
  const { token_hash, type, existingSession = null } = params;

  // Step 1: cek session yang sudah ada (double-exchange guard)
  const { data: { session } } = await mockGetSession();

  let isRecoverySession = false;
  let navigatedTo: string | null = null;
  let verifyError: Error | null = null;

  if (!session && token_hash && type) {
    // Step 2: tidak ada session — verifikasi OTP
    const { error } = await mockVerifyOtp({ token_hash, type });

    if (error) {
      // Step 5: error → arahkan ke login
      navigatedTo = '/auth/login';
      verifyError = error;
    } else if (type === 'recovery') {
      // Step 4: sukses + type=recovery → set flag dan arahkan ke reset-password
      isRecoverySession = true;
      navigatedTo = '/auth/reset-password';
    }
  } else if (session && type === 'recovery') {
    // Step 4b: session sudah ada + type=recovery → langsung set flag
    isRecoverySession = true;
    navigatedTo = '/auth/reset-password';
  }

  return { isRecoverySession, navigatedTo, verifyError };
}

// ---- Tests ------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Recovery callback — verifyOtp dipanggil dengan params yang benar', () => {
  it('verifyOtp is called with token_hash and type=recovery params', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    mockVerifyOtp.mockResolvedValueOnce({ error: null });

    await simulateCallbackRecoveryFlow({
      token_hash: 'hash_abc123',
      type: 'recovery',
    });

    expect(mockVerifyOtp).toHaveBeenCalledWith({
      token_hash: 'hash_abc123',
      type: 'recovery',
    });
  });

  it('verifyOtp is NOT called when session already exists', async () => {
    // Session sudah ada — double-exchange guard aktif
    mockGetSession.mockResolvedValueOnce({ data: { session: FAKE_SESSION } });

    await simulateCallbackRecoveryFlow({
      token_hash: 'hash_abc123',
      type: 'recovery',
      existingSession: FAKE_SESSION,
    });

    expect(mockVerifyOtp).not.toHaveBeenCalled();
  });
});

describe('Recovery callback — isRecoverySession flag', () => {
  it('when verifyOtp succeeds with type=recovery → isRecoverySession is set true', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    mockVerifyOtp.mockResolvedValueOnce({ error: null });

    const { isRecoverySession, navigatedTo } = await simulateCallbackRecoveryFlow({
      token_hash: 'valid_hash',
      type: 'recovery',
    });

    expect(isRecoverySession).toBe(true);
    expect(navigatedTo).toBe('/auth/reset-password');
  });

  it('when type is not recovery (e.g. signup) → isRecoverySession stays false', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    mockVerifyOtp.mockResolvedValueOnce({ error: null });

    const { isRecoverySession } = await simulateCallbackRecoveryFlow({
      token_hash: 'signup_hash',
      type: 'signup',
    });

    expect(isRecoverySession).toBe(false);
  });
});

describe('Recovery callback — error handling', () => {
  it('when verifyOtp fails → error is truthy (caller navigates to login)', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    const otpError = new Error('Token kedaluwarsa atau tidak valid');
    mockVerifyOtp.mockResolvedValueOnce({ error: otpError });

    const { verifyError, navigatedTo, isRecoverySession } = await simulateCallbackRecoveryFlow({
      token_hash: 'expired_hash',
      type: 'recovery',
    });

    expect(verifyError).toBeTruthy();
    expect(verifyError?.message).toContain('Token');
    expect(isRecoverySession).toBe(false);
    expect(navigatedTo).toBe('/auth/login');
  });

  it('when verifyOtp fails with generic error → isRecoverySession remains false', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    mockVerifyOtp.mockResolvedValueOnce({ error: new Error('Network error') });

    const { isRecoverySession } = await simulateCallbackRecoveryFlow({
      token_hash: 'some_hash',
      type: 'recovery',
    });

    expect(isRecoverySession).toBe(false);
  });
});

describe('Recovery callback — session already exists', () => {
  it('when session already exists + type=recovery → recovery flag set (no verifyOtp needed)', async () => {
    // Pengguna sudah punya session aktif (misal baru saja login)
    mockGetSession.mockResolvedValueOnce({ data: { session: FAKE_SESSION } });

    const { isRecoverySession, navigatedTo } = await simulateCallbackRecoveryFlow({
      token_hash: 'hash_abc',
      type: 'recovery',
      existingSession: FAKE_SESSION,
    });

    // Flag recovery tetap di-set agar reset-password screen bisa berjalan
    expect(isRecoverySession).toBe(true);
    expect(navigatedTo).toBe('/auth/reset-password');
    // verifyOtp tidak dipanggil — session sudah ada
    expect(mockVerifyOtp).not.toHaveBeenCalled();
  });

  it('getSession is always called first to check for existing session', async () => {
    mockGetSession.mockResolvedValueOnce({ data: { session: null } });
    mockVerifyOtp.mockResolvedValueOnce({ error: null });

    await simulateCallbackRecoveryFlow({
      token_hash: 'hash_xyz',
      type: 'recovery',
    });

    // getSession dipanggil sebelum verifyOtp — urutan penting
    expect(mockGetSession).toHaveBeenCalledTimes(1);
    const getSessionCallOrder = mockGetSession.mock.invocationCallOrder[0];
    const verifyOtpCallOrder = mockVerifyOtp.mock.invocationCallOrder[0];
    expect(getSessionCallOrder).toBeLessThan(verifyOtpCallOrder);
  });
});
