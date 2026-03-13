import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useOnboardingStore, Frequency } from '@/store/onboarding';
import { COLORS, FONTS, SPACING, SHADOWS } from '@/lib/constants';

interface FreqOption {
  value: Frequency;
  label: string;
}

const FREQ_OPTIONS: FreqOption[] = [
  { value: 'daily',     label: 'Setiap hari' },
  { value: '4-5x',      label: '4–5x seminggu' },
  { value: '2-3x',      label: '2–3x seminggu' },
  { value: 'as-needed', label: 'Saat butuh saja' },
];

/** Onboarding Screen 3 — Frequency selection */
export default function OnboardingFrequency() {
  const { frequency, setFrequency } = useOnboardingStore();

  return (
    <SafeScreen>
      <View className="flex-1 justify-between px-6 py-8">
        <View className="flex-1">
          <View className="mb-8">
            <Text
              style={{ fontFamily: FONTS.journal, color: COLORS.textPrimary, fontSize: 26, lineHeight: 34 }}
              className="mb-2"
            >
              Seberapa sering kamu ingin check-in?
            </Text>
          </View>

          <View className="gap-3">
            {FREQ_OPTIONS.map((opt) => {
              const isSelected = frequency === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setFrequency(opt.value)}
                  activeOpacity={0.7}
                  style={[
                    {
                      backgroundColor: COLORS.surface,
                      borderRadius: SPACING.cardRadius,
                      padding: SPACING.cardPadding + 4,
                      borderWidth: 2,
                      borderColor: isSelected ? COLORS.brandPrimary : COLORS.border,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                    isSelected ? {} : SHADOWS.card,
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: isSelected ? FONTS.sansSemi : FONTS.sans,
                      color: isSelected ? COLORS.brandPrimary : COLORS.textPrimary,
                      fontSize: 16,
                    }}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: COLORS.brandPrimary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 13 }}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="gap-6">
          <ProgressDots current={3} total={7} />
          <Button
            variant="primary"
            size="lg"
            label="Lanjut"
            disabled={!frequency}
            onPress={() => router.push('/onboarding/time')}
          />
        </View>
      </View>
    </SafeScreen>
  );
}
