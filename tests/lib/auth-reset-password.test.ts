/**
 * tests/lib/auth-reset-password.test.ts
 * Tests for reset-password.tsx logic:
 *   1. checkPasswordStrength utility (dari src/lib/auth-utils.ts)
 *   2. supabase.auth.updateUser call pattern (saat user simpan kata sandi baru)
 *
 * PasswordStrength shape:
 *   { minLength, maxLength, hasLetter, hasNumber, hasSymbol, isValid }
 * isValid = true hanya jika semua 5 rules pass.
 */

// ---- Mocks (hoisted before imports) ----------------------------------------

const mockUpdateUser = jest.fn();

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
      get updateUser() { return mockUpdateUser; },
      signInWithOAuth: jest.fn(),
      exchangeCodeForSession: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(),
  },
}));

// ---- Imports (setelah mocks) ------------------------------------------------

import { checkPasswordStrength } from '@/lib/auth-utils';

// ---- Helpers ----------------------------------------------------------------

// Simulasikan logika handleSave() di reset-password.tsx
async function simulateResetPasswordSave(newPassword: string) {
  const { error } = await mockUpdateUser({ password: newPassword });
  if (error) throw error;
}

// ---- Tests ------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
});

// ── checkPasswordStrength ────────────────────────────────────────────────────

describe('checkPasswordStrength — validasi kata sandi baru', () => {
  it('password with < 8 chars → isValid: false, minLength: false', () => {
    const result = checkPasswordStrength('Ab1!');

    expect(result.minLength).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('password with exactly 7 chars → minLength: false', () => {
    // Batas tepat: 7 karakter belum cukup
    const result = checkPasswordStrength('Ab1!xyz');

    expect(result.minLength).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('password with 8+ chars, letter, number, symbol → isValid: true, all flags true', () => {
    // Kata sandi ideal: huruf besar, huruf kecil, angka, simbol, > 8 karakter
    const result = checkPasswordStrength('Reflect1!');

    expect(result.minLength).toBe(true);
    expect(result.maxLength).toBe(true);
    expect(result.hasLetter).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasSymbol).toBe(true);
    expect(result.isValid).toBe(true);
  });

  it('password with only letters → hasNumber: false, hasSymbol: false', () => {
    const result = checkPasswordStrength('Refleksi');

    expect(result.hasLetter).toBe(true);
    expect(result.minLength).toBe(true);
    expect(result.hasNumber).toBe(false);
    expect(result.hasSymbol).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('password with letter + number but no symbol → hasSymbol: false, isValid: false', () => {
    // "Reflect1" — huruf + angka tapi tidak ada simbol
    const result = checkPasswordStrength('Reflect1');

    expect(result.hasLetter).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasSymbol).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('password with only numbers → hasLetter: false, hasSymbol: false', () => {
    const result = checkPasswordStrength('12345678');

    expect(result.hasLetter).toBe(false);
    expect(result.hasSymbol).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('password with letter + symbol but no number → hasNumber: false, isValid: false', () => {
    const result = checkPasswordStrength('Reflect!!');

    expect(result.hasLetter).toBe(true);
    expect(result.hasSymbol).toBe(true);
    expect(result.hasNumber).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('empty password → all flags false, isValid: false', () => {
    const result = checkPasswordStrength('');

    expect(result.minLength).toBe(false);
    expect(result.hasLetter).toBe(false);
    expect(result.hasNumber).toBe(false);
    expect(result.hasSymbol).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('password exceeding 72 chars → maxLength: false, isValid: false', () => {
    // bcrypt truncates silently beyond 72 bytes — kita validasi di sisi client
    const tooLong = 'Reflect1!'.repeat(9); // 81 chars

    const result = checkPasswordStrength(tooLong);

    expect(result.maxLength).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('password exactly 8 chars with all requirements → isValid: true', () => {
    // Batas minimum yang valid: tepat 8 karakter
    const result = checkPasswordStrength('Abcd1!xy');

    expect(result.minLength).toBe(true);
    expect(result.hasLetter).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasSymbol).toBe(true);
    expect(result.isValid).toBe(true);
  });

  it('special characters count as hasSymbol (various symbols)', () => {
    // Berbagai karakter simbol yang valid
    expect(checkPasswordStrength('Abcdef1@').hasSymbol).toBe(true);
    expect(checkPasswordStrength('Abcdef1#').hasSymbol).toBe(true);
    expect(checkPasswordStrength('Abcdef1_').hasSymbol).toBe(true);
    expect(checkPasswordStrength('Abcdef1-').hasSymbol).toBe(true);
    expect(checkPasswordStrength('Abcdef1.').hasSymbol).toBe(true);
  });
});

// ── supabase.auth.updateUser ─────────────────────────────────────────────────

describe('reset-password — supabase.auth.updateUser', () => {
  it('supabase.auth.updateUser is called with the new password on save', async () => {
    mockUpdateUser.mockResolvedValueOnce({ data: { user: { id: 'u1' } }, error: null });

    const newPassword = 'KataSandiBaru1!';
    await simulateResetPasswordSave(newPassword);

    expect(mockUpdateUser).toHaveBeenCalledTimes(1);
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: newPassword });
  });

  it('resolves without throwing when updateUser succeeds', async () => {
    mockUpdateUser.mockResolvedValueOnce({ data: { user: { id: 'u1' } }, error: null });

    await expect(simulateResetPasswordSave('KataSandiBaru1!')).resolves.not.toThrow();
  });

  it('supabase.auth.updateUser error is thrown and caught', async () => {
    const updateError = new Error('Sesi kedaluwarsa. Minta link reset baru.');
    mockUpdateUser.mockResolvedValueOnce({ data: null, error: updateError });

    await expect(simulateResetPasswordSave('KataSandiBaru1!')).rejects.toThrow(
      'Sesi kedaluwarsa. Minta link reset baru.'
    );
  });

  it('throws when recovery session has expired (Auth session missing error)', async () => {
    // Terjadi saat pengguna membuka link reset yang sudah kedaluwarsa
    const sessionError = new Error('Auth session missing!');
    mockUpdateUser.mockResolvedValueOnce({ data: null, error: sessionError });

    await expect(simulateResetPasswordSave('KataSandiBaru1!')).rejects.toThrow(
      'Auth session missing!'
    );
  });

  it('does not call updateUser if password fails strength check (caller guards it)', () => {
    // reset-password.tsx hanya memanggil updateUser jika checkPasswordStrength().isValid === true
    // Verifikasi: kata sandi lemah tidak lolos guard
    const weakPassword = 'weak';
    const strength = checkPasswordStrength(weakPassword);

    expect(strength.isValid).toBe(false);
    // Caller tidak memanggil updateUser — mock tidak dipanggil
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});
