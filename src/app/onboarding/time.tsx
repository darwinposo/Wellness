import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useOnboardingStore, TimePreference } from '@/store/onboarding';
import { COLORS, FONTS, SPACING, SHADOWS } from '@/lib/constants';

interface TimeOption {
  value: TimePreference;
  emoji: string;
  label: string;
  sublabel: string;
}

const TIME_OPTIONS: TimeOption[] = [
  { value: 'morning',   emoji: '🌅', label: 'Pagi',   sublabel: 'Mulai hari dengan niat positif' },
  { value: 'midday',    emoji: '☀️',  label: 'Siang',  sublabel: 'Jeda sejenak di tengah hari' },
  { value: 'afternoon', emoji: '🌇', label: 'Sore',   sublabel: 'Refleksi setelah aktivitas' },
  { value: 'night',     emoji: '🌙', label: 'Malam',  sublabel: 'Akhiri hari dengan tenang' },
];

/** Onboarding Screen 4 — Time preference */
export default function OnboardingTime() {
  const setTimePreference = useOnboardingStore((s) => s.setTimePreference);
  const [selected, setSelected] = useState<TimePreference>(null);

  return (
    <SafeScreen>
      <View className="flex-1 justify-between px-6 py-8">
        <View className="flex-1">
          <View className="mb-8">
            <Text
              style={{ fontFamily: FONTS.journal, color: COLORS.textPrimary, fontSize: 26, lineHeight: 34 }}
              className="mb-2"
            >
              Kapan waktu terbaikmu?
            </Text>
          </View>

          <View className="gap-3">
            {TIME_OPTIONS.map((opt) => {
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
                  <Text style={{ fontSize: 26, marginRight: 14 }}>{opt.emoji}</Text>
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

        <View className="gap-6">
          <ProgressDots current={4} total={7} />
          <Button
            variant="primary"
            size="lg"
            label="Lanjut"
            disabled={!selected}
            onPress={() => { setTimePreference(selected); router.push('/onboarding/preview' as any); }}
          />
        </View>
      </View>
    </SafeScreen>
  );
}
