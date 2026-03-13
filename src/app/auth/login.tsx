import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';
import { COLORS } from '@/lib/constants';

/** Login screen stub — full implementation in M002/S03 */
export default function LoginScreen() {
  const router = useRouter();
  const { setSession } = useAuthStore();
  const { reset } = useOnboardingStore();

  // DEV BYPASS: skip real auth until S03 builds login form
  function handleDevBypass() {
    setSession({ user: { id: 'dev-user', email: 'dev@reflect.id' } } as any);
    router.replace('/(tabs)');
  }

  function handleResetOnboarding() {
    reset();
    router.replace('/onboarding');
  }

  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-6">
        <Text
          style={{
            fontFamily: 'Lora_400Regular',
            fontSize: 28,
            color: COLORS.brandPrimary,
            marginBottom: 8,
          }}
        >
          Reflect
        </Text>
        <Text
          style={{
            fontFamily: 'PlusJakartaSans_400Regular',
            fontSize: 16,
            color: COLORS.textMuted,
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          Masuk untuk melanjutkan perjalananmu.
        </Text>
        <Button label="Lanjutkan (Dev)" onPress={handleDevBypass} />
        <Button
          label="Ulangi Onboarding"
          variant="secondary"
          onPress={handleResetOnboarding}
          style={{ marginTop: 12 }}
        />
      </View>
    </SafeScreen>
  );
}
