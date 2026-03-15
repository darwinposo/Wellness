/**
 * tests/lib/password-validation.test.ts
 * Tests for password strength rules and auth error mapping used in login.tsx
 */

import { checkPasswordStrength, mapAuthError } from '@/lib/auth-utils';

describe('checkPasswordStrength', () => {
  it('fails all rules for empty password', () => {
    const result = checkPasswordStrength('');
    expect(result.minLength).toBe(false);
    expect(result.hasLetter).toBe(false);
    expect(result.hasNumber).toBe(false);
    expect(result.hasSymbol).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it('passes minLength when >= 8 chars', () => {
    expect(checkPasswordStrength('abcdefgh').minLength).toBe(true);
    expect(checkPasswordStrength('abcdefg').minLength).toBe(false);
  });

  it('passes hasLetter when contains a-z or A-Z', () => {
    expect(checkPasswordStrength('abc12345').hasLetter).toBe(true);
    expect(checkPasswordStrength('12345678').hasLetter).toBe(false);
  });

  it('passes hasNumber when contains 0-9', () => {
    expect(checkPasswordStrength('abcdefg1').hasNumber).toBe(true);
    expect(checkPasswordStrength('abcdefgh').hasNumber).toBe(false);
  });

  it('passes hasSymbol when contains special character', () => {
    expect(checkPasswordStrength('abcdef1!').hasSymbol).toBe(true);
    expect(checkPasswordStrength('abcdef12').hasSymbol).toBe(false);
  });

  it('isValid only when all 4 rules pass', () => {
    expect(checkPasswordStrength('Abcdef1!').isValid).toBe(true);
    expect(checkPasswordStrength('abcdef1!').isValid).toBe(true);
    expect(checkPasswordStrength('Abcdef1').isValid).toBe(false); // no symbol
    expect(checkPasswordStrength('Abcdef!!').isValid).toBe(false); // no number
  });
});

describe('mapAuthError', () => {
  it('returns network error message for fetch/network errors', () => {
    expect(mapAuthError('network error')).toContain('koneksi');
    expect(mapAuthError('fetch failed')).toContain('koneksi');
  });

  it('returns sentinel for duplicate email (login.tsx shows custom two-button alert)', () => {
    // mapAuthError returns a sentinel string so login.tsx can render a custom alert
    // with a "Masuk" button — not a raw user-facing message.
    expect(mapAuthError('already registered')).toBe('email_already_registered');
    expect(mapAuthError('User already registered')).toBe('email_already_registered');
  });

  it('returns "verify email" message for unverified email login', () => {
    expect(mapAuthError('Email not confirmed')).toContain('erifikasi');
    expect(mapAuthError('email_not_confirmed')).toContain('erifikasi');
  });

  it('returns "wrong credentials" message for invalid login', () => {
    expect(mapAuthError('Invalid login credentials')).toContain('salah');
  });

  it('returns password hint for weak password rejection', () => {
    expect(mapAuthError('Password should be')).toContain('karakter');
  });

  it('returns generic fallback for unknown errors', () => {
    expect(mapAuthError('something unexpected')).toContain('coba lagi');
  });

  it('returns generic fallback for undefined', () => {
    expect(mapAuthError(undefined)).toContain('coba lagi');
  });
});
