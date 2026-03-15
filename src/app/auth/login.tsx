import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { COLORS, FONTS } from '@/lib/constants';
import { signInWithGoogle, signUpWithEmail, signInWithEmail, sendPasswordReset } from '@/lib/auth';
import { checkPasswordStrength, mapAuthError } from '@/lib/auth-utils';
import { supabase } from '@/lib/supabase';

type EmailMode = 'register' | 'login' | 'check-email';

export default function LoginScreen() {
  const [emailMode, setEmailMode] = useState<EmailMode>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState<'email' | 'google' | 'resend' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(0);

  const isLogin = emailMode === 'login';
  const strength = checkPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isEmailSubmitEnabled = isLogin
    ? email.trim().length > 0 && password.length > 0
    : email.trim().length > 0 && password.length > 0 && confirmPassword.length > 0;

  async function handleGoogle() {
    if (loading) return;
    setLoading('google');
    try {
      await signInWithGoogle();
      // Don't reset loading — if sign-in succeeded, _layout.tsx will navigate
      // away and unmount this screen. Resetting loading re-enables the button
      // briefly, allowing double-tap on slow networks.
      // If user cancelled (dismissed browser), signInWithGoogle returns without
      // establishing a session, so we reset loading below.
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) setLoading(null); // User cancelled — re-enable UI
    } catch (err: any) {
      Alert.alert('Gagal Masuk', mapAuthError(err?.message), [{ text: 'Oke' }]);
      setLoading(null);
    }
  }

  async function handleEmailAuth() {
    if (loading) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert('Eh, ada yang kosong', 'Isi email dan kata sandi dulu ya.', [{ text: 'Oke' }]);
      return;
    }
    if (!isLogin) {
      if (!passwordsMatch) {
        Alert.alert('Kata sandi tidak sama', 'Pastikan kedua kata sandi kamu sama ya.', [{ text: 'Oke' }]);
        return;
      }
      if (!strength.isValid) {
        Alert.alert('Kata sandi terlalu lemah', 'Pastikan kata sandi minimal 8 karakter, mengandung huruf, angka, dan simbol.', [{ text: 'Oke' }]);
        return;
      }
    }
    setLoading('email');
    try {
      if (isLogin) {
        await signInWithEmail(trimmedEmail, password);
        // Don't reset loading — _layout.tsx will navigate away and unmount this screen.
        // Resetting here re-enables the button briefly, allowing double-submit on slow networks.
        return;
      } else {
        await signUpWithEmail(trimmedEmail, password);
        setEmailMode('check-email');
      }
    } catch (err: any) {
      const mapped = mapAuthError(err?.message);
      if (mapped === 'email_already_registered') {
        Alert.alert(
          'Email sudah terdaftar 👋',
          'Sepertinya kamu sudah punya akun dengan email ini. Langsung masuk aja yuk!',
          [
            { text: 'Batal', style: 'cancel' },
            {
              text: 'Masuk sekarang',
              onPress: () => {
                setEmailMode('login');
                setPassword('');
                setConfirmPassword('');
                setShowPassword(false);
                setShowConfirm(false);
              },
            },
          ]
        );
      } else {
        Alert.alert('Gagal', mapped, [{ text: 'Oke' }]);
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleResend() {
    if (loading) return;
    setLoading('resend');
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim() });
      if (error) throw error;
      Alert.alert('Link Terkirim', 'Tautan verifikasi baru sudah dikirim. Cek inbox dan folder spam ya.', [{ text: 'Oke' }]);
    } catch {
      Alert.alert('Gagal', 'Tidak bisa mengirim ulang tautan. Coba lagi dalam beberapa menit ya.', [{ text: 'Oke' }]);
    } finally {
      setLoading(null);
    }
  }

  async function handleForgotPassword() {
    if (resetCooldown > 0) {
      Alert.alert('Tunggu sebentar', `Kamu baru saja meminta link reset. Coba lagi dalam ${resetCooldown} detik ya.`, [{ text: 'Oke' }]);
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert('Email kosong', 'Masukkan email kamu dulu, baru kita kirim link reset-nya ya.', [{ text: 'Oke' }]);
      return;
    }
    Alert.alert(
      'Reset kata sandi',
      `Kami akan kirim link reset ke:\n\n${trimmedEmail}\n\nCek inbox atau folder spam ya.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Kirim',
          onPress: async () => {
            try {
              await sendPasswordReset(trimmedEmail);
              // Start 60-second cooldown to prevent email flooding
              setResetCooldown(60);
              const interval = setInterval(() => {
                setResetCooldown(c => {
                  if (c <= 1) { clearInterval(interval); return 0; }
                  return c - 1;
                });
              }, 1000);
            } catch {
              // Always show success — never reveal if email exists (anti-enumeration)
            }
            // Always show success message regardless of outcome
            Alert.alert('Link Terkirim 📬', 'Kalau email kamu terdaftar, link reset sudah kami kirim. Cek inbox dan folder spam ya.', [{ text: 'Oke' }]);
          },
        },
      ]
    );
  }

  // ── Check email screen ────────────────────────────────────────────────────
  if (emailMode === 'check-email') {
    return (
      <SafeScreen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 56, marginBottom: 24 }}>📬</Text>
          <Text style={{
            fontFamily: FONTS.sansSemi, fontSize: 22,
            color: COLORS.textPrimary, textAlign: 'center', marginBottom: 16,
          }}>
            Cek email kamu
          </Text>
          <Text style={{
            fontFamily: FONTS.sans, fontSize: 15,
            color: COLORS.textMuted, textAlign: 'center',
            lineHeight: 24, marginBottom: 12,
          }}>
            Kami sudah kirim tautan ke:
          </Text>
          <Text style={{
            fontFamily: FONTS.sansSemi, fontSize: 15,
            color: COLORS.textPrimary, textAlign: 'center', marginBottom: 12,
          }}>
            {email}
          </Text>
          <Text style={{
            fontFamily: FONTS.sans, fontSize: 14,
            color: COLORS.textMuted, textAlign: 'center',
            lineHeight: 22, marginBottom: 40,
          }}>
            Klik link di email, lalu kembali ke sini untuk masuk.{'\n'}
            Jika tidak ada, cek folder <Text style={{ fontFamily: FONTS.sansSemi }}>Spam</Text>.
          </Text>

          <TouchableOpacity
            onPress={() => setEmailMode('login')}
            activeOpacity={0.85}
            style={{
              alignSelf: 'stretch', height: 52, borderRadius: 8,
              backgroundColor: COLORS.brandPrimary,
              alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}
          >
            <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 16, color: '#fff' }}>
              Sudah klik link-nya? Masuk
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResend}
            disabled={loading === 'resend'}
            activeOpacity={0.7}
            style={{
              alignSelf: 'stretch', height: 48, borderRadius: 8,
              borderWidth: 1, borderColor: COLORS.border,
              alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            }}
          >
            <Text style={{ fontFamily: FONTS.sans, fontSize: 15, color: COLORS.textPrimary }}>
              {loading === 'resend' ? 'Mengirim...' : 'Kirim ulang link'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setEmail(''); setPassword(''); setConfirmPassword(''); setEmailMode('register'); }}>
            <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: COLORS.textMuted }}>
              Daftar dengan email lain
            </Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  // ── Main auth screen ──────────────────────────────────────────────────────
  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <Text style={{
            fontFamily: FONTS.sansSemi, fontSize: 32,
            color: COLORS.brandPrimary, textAlign: 'center', marginBottom: 8,
          }}>
            Reflect
          </Text>

          {/* Headline */}
          <Text style={{
            fontFamily: FONTS.journal, fontSize: 22,
            color: COLORS.textPrimary, textAlign: 'center', marginBottom: 32,
          }}>
            Mulai perjalananmu
          </Text>

          {/* ── Google — primary CTA, always first ── */}
          <TouchableOpacity
            onPress={handleGoogle}
            disabled={loading !== null}
            activeOpacity={0.85}
            style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: '#4285F4', borderRadius: 6,
              padding: 2, paddingRight: 16,
              opacity: loading !== null ? 0.7 : 1,
              marginBottom: 24,
            }}
          >
            {/* White square with Google G logo */}
            <View style={{
              width: 36, height: 36,
              backgroundColor: '#fff',
              borderRadius: 4,
              alignItems: 'center', justifyContent: 'center',
              marginRight: 12,
            }}>
              <AntDesign name="google" size={20} color="#4285F4" />
            </View>
            <Text style={{
              fontFamily: FONTS.sansSemi, fontSize: 14,
              color: '#fff', includeFontPadding: false,
              letterSpacing: 0.5, flex: 1, textAlign: 'center',
              marginRight: 36, // optically center text accounting for logo width
            }}>
              {loading === 'google' ? 'Menghubungkan...' : 'Masuk dengan Google'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            <Text style={{ fontFamily: FONTS.sans, fontSize: 13, color: COLORS.textMuted, marginHorizontal: 12 }}>
              atau pakai email
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          </View>

          {/* ── Email form ── */}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={loading === null}
            style={inputStyle}
          />

          <View style={{ marginBottom: !isLogin ? 8 : 12 }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Kata sandi"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              editable={loading === null}
              style={{ ...inputStyle, marginBottom: 0, paddingRight: 48 }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(v => !v)}
              style={eyeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot password — login only */}
          {isLogin && (
            <TouchableOpacity
              onPress={handleForgotPassword}
              disabled={loading !== null}
              style={{ alignSelf: 'flex-end', paddingVertical: 4, paddingHorizontal: 2, marginBottom: 8, marginTop: -4 }}
            >
              <Text style={{ fontFamily: FONTS.sans, fontSize: 13, color: resetCooldown > 0 ? COLORS.textMuted : COLORS.brandPrimary }}>
                {resetCooldown > 0 ? `Kirim ulang dalam ${resetCooldown}s` : 'Lupa kata sandi?'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Password strength — register only, 2×2 compact grid */}
          {!isLogin && (
            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                <StrengthRow pass={strength.minLength} label="8+ karakter" />
                <StrengthRow pass={strength.hasLetter} label="Huruf (a-z)" />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <StrengthRow pass={strength.hasNumber} label="Angka (0-9)" />
                <StrengthRow pass={strength.hasSymbol} label="Simbol (!@#)" />
              </View>
            </View>
          )}

          {/* Confirm password — register only */}
          {!isLogin && (
            <>
              <View style={{ marginBottom: 4 }}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Ulangi kata sandi"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showConfirm}
                  editable={loading === null}
                  style={{
                    ...inputStyle,
                    marginBottom: 0,
                    paddingRight: 48,
                    borderColor: confirmPassword.length > 0
                      ? (passwordsMatch ? '#22c55e' : '#ef4444')
                      : COLORS.border,
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(v => !v)}
                  style={eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
              <Text style={{
                fontFamily: FONTS.sans, fontSize: 12, marginBottom: 16,
                color: confirmPassword.length === 0
                  ? 'transparent'
                  : passwordsMatch ? '#22c55e' : '#ef4444',
              }}>
                {passwordsMatch ? '✓ Kata sandi cocok' : '✗ Kata sandi tidak cocok'}
              </Text>
            </>
          )}

          {/* Submit */}
          <TouchableOpacity
            onPress={handleEmailAuth}
            disabled={loading !== null || !isEmailSubmitEnabled}
            activeOpacity={0.85}
            style={{
              height: 54, borderRadius: 8,
              backgroundColor: (loading !== null || !isEmailSubmitEnabled)
                ? '#C8C8D0'
                : COLORS.brandPrimary,
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={{
              fontFamily: FONTS.sansSemi, fontSize: 16,
              color: (loading !== null || !isEmailSubmitEnabled) ? '#8E8E9A' : '#fff',
              includeFontPadding: false, paddingHorizontal: 16,
            }}>
              {loading === 'email'
                ? (isLogin ? 'Sedang masuk...' : 'Mendaftar...')
                : (isLogin ? 'Masuk' : 'Gabung')}
            </Text>
          </TouchableOpacity>

          {/* Toggle register ↔ login — single Text node prevents edge clipping */}
          <Text
            style={{
              fontFamily: FONTS.sans, fontSize: 14, color: COLORS.textMuted,
              textAlign: 'center', marginBottom: 20,
            }}
          >
            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <Text
              onPress={loading === null ? () => {
                setEmailMode(isLogin ? 'register' : 'login');
                setPassword('');
                setConfirmPassword('');
                setShowPassword(false);
                setShowConfirm(false);
              } : undefined}
              style={{ fontFamily: FONTS.sansSemi, color: COLORS.brandPrimary }}
            >
              {isLogin ? 'Gabung' : 'Masuk'}
            </Text>
          </Text>

          {/* Terms */}
          <Text style={{
            fontFamily: FONTS.sans, fontSize: 12,
            color: COLORS.textMuted, textAlign: 'center',
            lineHeight: 18,
          }}>
            Dengan melanjutkan, kamu setuju dengan{' '}
            <Text style={{ color: COLORS.brandPrimary }}>Syarat & Ketentuan</Text>
            {' '}dan{' '}
            <Text style={{ color: COLORS.brandPrimary }}>Kebijakan Privasi</Text>
            {' '}kami.
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function StrengthRow({ pass, label }: { pass: boolean; label: string }) {
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 2 }}>
      <Text style={{ width: 16, fontSize: 12, color: pass ? '#22c55e' : COLORS.textMuted }}>
        {pass ? '✓' : '·'}
      </Text>
      <Text style={{ fontFamily: FONTS.sans, fontSize: 12, color: pass ? '#22c55e' : COLORS.textMuted }}>
        {label}
      </Text>
    </View>
  );
}

const eyeBtn = {
  position: 'absolute' as const,
  right: 14,
  top: 0,
  bottom: 0,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const inputStyle = {
  height: 52,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: COLORS.border,
  paddingHorizontal: 16,
  marginBottom: 12,
  fontFamily: FONTS.sans,
  fontSize: 15,
  color: COLORS.textPrimary,
  backgroundColor: '#fff',
};
