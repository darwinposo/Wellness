/**
 * Auth utility functions — password validation and error message mapping.
 * Kept separate from auth.ts so they can be unit-tested without Supabase mocks.
 */

export interface PasswordStrength {
  minLength: boolean; // >= 8 characters
  maxLength: boolean; // <= 72 characters (bcrypt truncation limit)
  hasLetter: boolean; // contains a-z or A-Z
  hasNumber: boolean; // contains 0-9
  hasSymbol: boolean; // contains special character
  isValid: boolean;   // all rules pass
}

/**
 * Checks password against 4 strength rules.
 * All 4 must pass before the user can submit the register form.
 */
export function checkPasswordStrength(password: string): PasswordStrength {
  const minLength = password.length >= 8;
  const maxLength = password.length <= 72; // bcrypt silently truncates beyond 72 bytes
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const isValid = minLength && maxLength && hasLetter && hasNumber && hasSymbol;
  return { minLength, maxLength, hasLetter, hasNumber, hasSymbol, isValid };
}

/**
 * Maps Supabase/network error messages to user-friendly Bahasa Indonesia strings.
 */
export function mapAuthError(message: string | undefined): string {
  if (!message) return 'Terjadi kesalahan. Silakan coba lagi.';
  const m = message.toLowerCase();
  if (m.includes('network') || m.includes('fetch')) {
    return 'Tidak ada koneksi internet. Coba lagi.';
  }
  if (m.includes('email_already_registered') || m.includes('already') || m.includes('registered')) {
    return 'email_already_registered';
  }
  if (m.includes('not confirmed') || m.includes('email_not_confirmed')) {
    return 'Verifikasi email kamu dulu. Cek inbox atau folder spam.';
  }
  if (m.includes('invalid login') || m.includes('invalid credentials')) {
    return 'Email atau kata sandi salah.';
  }
  if (m.includes('password should be') || m.includes('password')) {
    return 'Kata sandi minimal 8 karakter, huruf, angka, dan simbol.';
  }
  return 'Gagal masuk. Silakan coba lagi.';
}
