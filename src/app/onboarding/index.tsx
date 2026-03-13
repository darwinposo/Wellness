import { View, Text } from 'react-native';
import { SafeScreen } from '@/components/ui/SafeScreen';

/** Onboarding Screen 1 — Value Prop (stub) */
export default function OnboardingValueProp() {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-text-primary mb-2 text-center">
          Teman curhat AI-mu ada di sini
        </Text>
        <Text className="text-base text-text-muted text-center">
          Onboarding Screen 1
        </Text>
      </View>
    </SafeScreen>
  );
}
