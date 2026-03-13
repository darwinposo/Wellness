import { View, Text } from 'react-native';
import { SafeScreen } from '@/components/ui/SafeScreen';

/** Login screen stub — full implementation in M002/S03/T02 */
export default function LoginScreen() {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-brand-primary mb-2">Reflect</Text>
        <Text className="text-base text-text-muted text-center">
          Masuk untuk melanjutkan perjalananmu.
        </Text>
      </View>
    </SafeScreen>
  );
}
