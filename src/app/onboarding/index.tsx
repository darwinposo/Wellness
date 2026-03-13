import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { COLORS, FONTS } from '@/lib/constants';

/** Onboarding Screen 1 — Value Prop */
export default function OnboardingValueProp() {
  return (
    <SafeScreen>
      <View className="flex-1 justify-between px-6 py-8">
        {/* Hero */}
        <View className="flex-1 items-center justify-center">
          <View
            style={{ width: 180, height: 180, borderRadius: 90, backgroundColor: '#FDE8DC' }}
            className="items-center justify-center mb-10"
          >
            <Text style={{ fontSize: 72 }}>🌿</Text>
          </View>

          <Text
            style={{ fontFamily: FONTS.journal, color: COLORS.textPrimary, fontSize: 28, lineHeight: 36 }}
            className="text-center mb-4"
          >
            Teman curhat AI-mu ada di sini
          </Text>

          <Text
            style={{ fontFamily: FONTS.sans, color: COLORS.textMuted, fontSize: 15, lineHeight: 24 }}
            className="text-center px-2"
          >
            Reflect membantu kamu memahami perasaan, mengelola stres, dan tumbuh setiap hari — dengan
            pendampingan AI yang hangat dan personal.
          </Text>
        </View>

        {/* Bottom: dots + CTA */}
        <View className="gap-6">
          <ProgressDots current={1} total={7} />
          <Button variant="primary" size="lg" label="Mulai Perjalananmu" onPress={() => router.push('/onboarding/goal')} />
        </View>
      </View>
    </SafeScreen>
  );
}
