import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useOnboardingStore, Goal } from '@/store/onboarding';
import { COLORS, FONTS, SPACING, SHADOWS } from '@/lib/constants';

interface GoalOption {
  value: Goal;
  emoji: string;
  label: string;
  sublabel: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  { value: 'stress',    emoji: '😌', label: 'Kelola Stres',      sublabel: 'Kurangi kecemasan sehari-hari' },
  { value: 'sleep',     emoji: '😴', label: 'Tidur Lebih Baik',  sublabel: 'Tenangkan pikiran sebelum tidur' },
  { value: 'happiness', emoji: '😊', label: 'Lebih Bahagia',     sublabel: 'Tingkatkan suasana hati secara konsisten' },
];

/** Onboarding Screen 2 — Goal selection */
export default function OnboardingGoal() {
  const setGoal = useOnboardingStore((s) => s.setGoal);
  const [selected, setSelected] = useState<Goal>(null);

  return (
    <SafeScreen>
      <View className="flex-1 justify-between px-6 py-8">
        <View className="flex-1">
          {/* Header */}
          <View className="mb-8">
            <Text
              style={{ fontFamily: FONTS.journal, color: COLORS.textPrimary, fontSize: 26, lineHeight: 34 }}
              className="mb-2"
            >
              Apa tujuan utamamu?
            </Text>
            <Text style={{ fontFamily: FONTS.sans, color: COLORS.textMuted, fontSize: 15 }}>
              Kami akan menyesuaikan pengalamanmu.
            </Text>
          </View>

          {/* Goal cards */}
          <View className="gap-3">
            {GOAL_OPTIONS.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setSelected(opt.value)}
                  activeOpacity={0.7}
                  style={[
                    {
                      backgroundColor: COLORS.surface,
                      borderRadius: SPACING.cardRadius,
                      padding: SPACING.cardPadding,
                      borderWidth: 2,
                      borderColor: isSelected ? COLORS.brandPrimary : COLORS.border,
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                    isSelected ? {} : SHADOWS.card,
                  ]}
                >
                  <Text style={{ fontSize: 28, marginRight: 14 }}>{opt.emoji}</Text>
                  <View className="flex-1">
                    <Text
                      style={{
                        fontFamily: FONTS.sansSemi,
                        color: isSelected ? COLORS.brandPrimary : COLORS.textPrimary,
                        fontSize: 16,
                        marginBottom: 2,
                      }}
                    >
                      {opt.label}
                    </Text>
                    <Text style={{ fontFamily: FONTS.sans, color: COLORS.textMuted, fontSize: 13 }}>
                      {opt.sublabel}
                    </Text>
                  </View>
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

        {/* Bottom: dots + CTA */}
        <View className="gap-6">
          <ProgressDots current={2} total={7} />
          <Button
            variant="primary"
            size="lg"
            label="Lanjut"
            disabled={!selected}
            onPress={() => { setGoal(selected); router.push('/onboarding/frequency'); }}
          />
        </View>
      </View>
    </SafeScreen>
  );
}
