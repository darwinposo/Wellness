import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { useOnboardingStore } from '@/store/onboarding';
import { COLORS, FONTS, SPACING, SHADOWS } from '@/lib/constants';

const GOAL_LABELS: Record<string, string> = {
  stress:    'Kelola Stres',
  sleep:     'Tidur Lebih Baik',
  happiness: 'Lebih Bahagia',
};

const FREQ_LABELS: Record<string, string> = {
  'daily':     'Setiap hari',
  '4-5x':      '4–5x seminggu',
  '2-3x':      '2–3x seminggu',
  'as-needed': 'Saat butuh saja',
};

const TIME_LABELS: Record<string, string> = {
  morning:   'Pagi',
  midday:    'Siang',
  afternoon: 'Sore',
  night:     'Malam',
};

/** Onboarding Screen 5 — Personalized plan preview */
export default function OnboardingPreview() {
  const { goal, frequency, timePreference } = useOnboardingStore();

  const goalLabel = goal ? GOAL_LABELS[goal] : '—';
  const freqLabel = frequency ? FREQ_LABELS[frequency] : '—';
  const timeLabel = timePreference ? TIME_LABELS[timePreference] : '—';

  return (
    <SafeScreen>
      <View className="flex-1 justify-between px-6 py-8">
        <View className="flex-1">
          {/* Header */}
          <View className="mb-8">
            <Text
              style={{ fontFamily: FONTS.journal, color: COLORS.textPrimary, fontSize: 28, lineHeight: 36 }}
              className="mb-2"
            >
              Rencanamu sudah siap! 🎉
            </Text>
            <Text style={{ fontFamily: FONTS.sans, color: COLORS.textMuted, fontSize: 15 }}>
              Berdasarkan pilihanmu:
            </Text>
          </View>

          {/* Plan summary card */}
          <View
            style={[
              {
                backgroundColor: COLORS.surface,
                borderRadius: SPACING.cardRadius,
                padding: SPACING.cardPadding + 4,
                borderWidth: 2,
                borderColor: COLORS.brandPrimary,
              },
              SHADOWS.card,
            ]}
          >
            <PlanRow emoji="🎯" label="Tujuan" value={goalLabel} />
            <PlanRow emoji="📅" label="Frekuensi" value={freqLabel} />
            <PlanRow emoji="⏰" label="Waktu terbaik" value={timeLabel} />

            <View
              style={{
                marginTop: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: COLORS.border,
              }}
            >
              <Text
                style={{ fontFamily: FONTS.sansSemi, color: COLORS.brandPrimary, fontSize: 14, lineHeight: 20 }}
              >
                → AI akan mengingatkanmu {timeLabel.toLowerCase()} dengan sesi personal
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-6">
          <ProgressDots current={5} total={7} />
          <Button
            variant="primary"
            size="lg"
            label="Lihat Contoh Sesinya"
            onPress={() => router.push('/onboarding/taste' as any)}
          />
        </View>
      </View>
    </SafeScreen>
  );
}

function PlanRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      <Text style={{ fontSize: 20, width: 32 }}>{emoji}</Text>
      <Text style={{ fontFamily: FONTS.sans, color: COLORS.textMuted, fontSize: 14, width: 100 }}>
        {label}
      </Text>
      <Text style={{ fontFamily: FONTS.sansSemi, color: COLORS.textPrimary, fontSize: 14, flex: 1 }}>
        {value}
      </Text>
    </View>
  );
}
