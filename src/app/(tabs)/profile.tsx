import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';
import { signOut } from '@/lib/auth';
import { COLORS, FONTS } from '@/lib/constants';

/**
 * Profile tab — M002/S03
 * Shows current user info + sign-out button.
 * Sign-out navigated back to login via onAuthStateChange in _layout.tsx.
 */
export default function ProfileScreen() {
  const { session } = useAuthStore();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    if (loading) return;
    setLoading(true);
    try {
      await signOut();
      // _layout.tsx onAuthStateChange fires → redirects to /auth/login
    } catch {
      Alert.alert('Gagal Keluar', 'Silakan coba lagi.', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  }

  const email = session?.user?.email ?? '';

  return (
    <SafeScreen>
      <View className="flex-1 justify-between px-6 py-8">
        <View>
          <Text
            style={{
              fontFamily: FONTS.journal,
              fontSize: 26,
              color: COLORS.textPrimary,
              marginBottom: 4,
            }}
          >
            Profil
          </Text>
          {email ? (
            <Text
              style={{
                fontFamily: FONTS.sans,
                fontSize: 14,
                color: COLORS.textMuted,
              }}
            >
              {email}
            </Text>
          ) : null}
        </View>

        <Button
          label={loading ? 'Keluar...' : 'Keluar'}
          variant="ghost"
          onPress={handleSignOut}
        />
      </View>
    </SafeScreen>
  );
}
