import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { COLORS, FONTS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { checkPasswordStrength } from '@/lib/auth-utils';
import { useAuthStore } from '@/store/auth';

// Recovery sessions expire — 10 minutes to complete the reset
const RECOVERY_TIMEOUT_MS = 10 * 60 * 1000;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { isRecoverySession, setRecoverySession } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const strength = checkPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isEnabled = password.length > 0 && confirmPassword.length > 0 && !loading;

  // SECURITY: Guard — only reachable via PASSWORD_RECOVERY event.
  // Verifies: (1) in-memory recovery flag set by callback.tsx,
  //           (2) Supabase confirms session is still valid server-side.
  // Direct navigation, shared links, or stolen sessions are all blocked.
  useEffect(() => {
    if (!isRecoverySession) {
      router.replace('/auth/login' as any);
      return;
    }

    // Verify session is genuinely valid with the Supabase server.
    // getUser() makes a network call — unlike getSession() which only reads cache.
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        setRecoverySession(false);
        Alert.alert(
          'Sesi tidak valid',
          'Link reset kamu sudah tidak berlaku. Silakan minta link baru ya.',
          [{ text: 'Oke', onPress: () => router.replace('/auth/login' as any) }]
        );
        return;
      }

      // SECURITY: Auto-expire after 10 minutes to limit attack window.
      // Supabase token itself expires in 1 hour, but we enforce a tighter window.
      timerRef.current = setTimeout(async () => {
        await supabase.auth.signOut().catch(() => {});
        setRecoverySession(false);
        Alert.alert(
          'Sesi kadaluarsa',
          'Terlalu lama tidak aktif. Silakan minta link reset baru ya.',
          [{ text: 'Oke', onPress: () => router.replace('/auth/login' as any) }]
        );
      }, RECOVERY_TIMEOUT_MS);
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRecoverySession]);

  async function handleSave() {
    if (password.length > 72) {
      Alert.alert('Kata sandi terlalu panjang', 'Maksimal 72 karakter ya.', [{ text: 'Oke' }]);
      return;
    }
    if (!strength.isValid) {
      Alert.alert('Kata sandi terlalu lemah', 'Pastikan minimal 8 karakter, mengandung huruf, angka, dan simbol.', [{ text: 'Oke' }]);
      return;
    }
    if (!passwordsMatch) {
      Alert.alert('Kata sandi tidak sama', 'Pastikan kedua kata sandi kamu sama ya.', [{ text: 'Oke' }]);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      // SECURITY: Revoke all other active sessions (other devices) so a compromised
      // session cannot persist after the password is changed.
      await supabase.auth.signOut({ scope: 'others' }).catch(() => {});

      // Clear the auto-expiry timer
      if (timerRef.current) clearTimeout(timerRef.current);

      // Show success alert BEFORE local sign-out — otherwise _layout.tsx would
      // redirect to login immediately (SIGNED_OUT event) and dismiss the alert.
      Alert.alert(
        'Kata sandi berhasil diubah 🎉',
        'Kata sandi baru kamu sudah aktif. Silakan masuk dengan kata sandi baru ya.',
        [{
          text: 'Masuk sekarang',
          onPress: async () => {
            setRecoverySession(false);
            // Local sign-out triggers SIGNED_OUT → _layout.tsx navigates to login
            await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
          },
        }]
      );
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() ?? '';
      const isExpired = msg.includes('expired') || msg.includes('invalid') || msg.includes('401');
      if (isExpired) {
        Alert.alert(
          'Sesi kadaluarsa',
          'Link reset kamu sudah tidak valid. Silakan minta link reset baru.',
          [{ text: 'Oke', onPress: () => router.replace('/auth/login' as any) }]
        );
      } else {
        Alert.alert('Gagal', 'Tidak bisa menyimpan kata sandi baru. Coba lagi ya.', [{ text: 'Oke' }]);
      }
    } finally {
      setLoading(false);
    }
  }

  // If not a recovery session, render nothing while redirecting
  if (!isRecoverySession) return null;

  return (
    <SafeScreen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>🔑</Text>
          <Text style={{ fontFamily: FONTS.sansSemi, fontSize: 24, color: COLORS.textPrimary, textAlign: 'center', marginBottom: 8 }}>
            Buat kata sandi baru
          </Text>
          <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 36 }}>
            Pilih kata sandi yang kuat dan mudah kamu ingat ya.
          </Text>

          {/* New password */}
          <View style={{ marginBottom: 8 }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Kata sandi baru"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              editable={!loading}
              maxLength={72}
              style={{ ...inputStyle, marginBottom: 0, paddingRight: 48 }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(v => !v)}
              style={eyeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Strength indicators — 2×2 compact grid */}
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

          {/* Confirm password */}
          <View style={{ marginBottom: 4 }}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Ulangi kata sandi baru"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showConfirm}
              editable={!loading}
              maxLength={72}
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
              <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={{
            fontFamily: FONTS.sans, fontSize: 12, marginBottom: 24,
            color: confirmPassword.length === 0 ? 'transparent' : passwordsMatch ? '#22c55e' : '#ef4444',
          }}>
            {passwordsMatch ? '✓ Kata sandi cocok' : '✗ Kata sandi tidak cocok'}
          </Text>

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isEnabled}
            activeOpacity={0.85}
            style={{
              height: 54, borderRadius: 8,
              backgroundColor: isEnabled ? COLORS.brandPrimary : '#C8C8D0',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{
              fontFamily: FONTS.sansSemi, fontSize: 16,
              color: isEnabled ? '#fff' : '#8E8E9A',
              includeFontPadding: false,
            }}>
              {loading ? 'Menyimpan...' : 'Simpan kata sandi baru'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              if (timerRef.current) clearTimeout(timerRef.current);
              await supabase.auth.signOut().catch(() => {});
              setRecoverySession(false);
              router.replace('/auth/login' as any);
            }}
            style={{ alignItems: 'center', paddingVertical: 8 }}
          >
            <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: COLORS.textMuted }}>
              Kembali ke halaman masuk
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

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
  right: 14, top: 0, bottom: 0,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const inputStyle = {
  height: 52, borderRadius: 8, borderWidth: 1,
  borderColor: COLORS.border, paddingHorizontal: 16,
  marginBottom: 12, fontFamily: FONTS.sans,
  fontSize: 15, color: COLORS.textPrimary, backgroundColor: '#fff',
};
