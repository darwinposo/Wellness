import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { COLORS, FONTS, SPACING } from '@/lib/constants';

const MOOD_OPTIONS = ['😔 Berat', '😐 Biasa', '😊 Baik', '🤩 Luar biasa'];

// Hardcoded AI response — real Claude API is wired in M003
const AI_RESPONSE =
  'Aduh, hari yang berat ya? Cerita lebih dong — apa yang paling bikin kamu capek hari ini?';

/** Onboarding Screen 6 — Mock AI journal taste */
export default function OnboardingTaste() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-between px-6 py-8" style={{ minHeight: '100%' }}>
          <View className="flex-1">
            {/* Header */}
            <View className="mb-8">
              <Text
                style={{ fontFamily: FONTS.journal, color: COLORS.textPrimary, fontSize: 26, lineHeight: 34 }}
              >
                Begini rasanya sesi denganku
              </Text>
            </View>

            {/* AI message bubble */}
            <View
              style={{
                backgroundColor: '#FDE8DC',
                borderRadius: 16,
                borderBottomLeftRadius: 4,
                padding: SPACING.cardPadding,
                marginBottom: 20,
                alignSelf: 'flex-start',
                maxWidth: '85%',
              }}
            >
              <Text style={{ fontFamily: FONTS.sans, color: COLORS.textPrimary, fontSize: 15, lineHeight: 22 }}>
                Bagaimana perasaanmu hari ini?
              </Text>
            </View>

            {/* Mood selector */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = selectedMood === mood;
                return (
                  <TouchableOpacity
                    key={mood}
                    onPress={() => setSelectedMood(mood)}
                    activeOpacity={0.7}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor: isSelected ? COLORS.brandPrimary : COLORS.border,
                      backgroundColor: isSelected ? '#FDE8DC' : COLORS.surface,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: isSelected ? FONTS.sansSemi : FONTS.sans,
                        color: isSelected ? COLORS.brandPrimary : COLORS.textPrimary,
                        fontSize: 14,
                      }}
                    >
                      {mood}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* AI reply — appears after mood selection */}
            {selectedMood && (
              <View>
                {/* User bubble */}
                <View
                  style={{
                    backgroundColor: COLORS.brandPrimary,
                    borderRadius: 16,
                    borderBottomRightRadius: 4,
                    padding: SPACING.cardPadding,
                    marginBottom: 12,
                    alignSelf: 'flex-end',
                    maxWidth: '75%',
                  }}
                >
                  <Text style={{ fontFamily: FONTS.sans, color: '#fff', fontSize: 15 }}>
                    {selectedMood}
                  </Text>
                </View>

                {/* AI response bubble */}
                <View
                  style={{
                    backgroundColor: '#FDE8DC',
                    borderRadius: 16,
                    borderBottomLeftRadius: 4,
                    padding: SPACING.cardPadding,
                    alignSelf: 'flex-start',
                    maxWidth: '85%',
                  }}
                >
                  <Text style={{ fontFamily: FONTS.sans, color: COLORS.textPrimary, fontSize: 15, lineHeight: 22 }}>
                    {AI_RESPONSE}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View className="gap-6" style={{ marginTop: 24 }}>
            <ProgressDots current={6} total={7} />
            <Button
              variant="primary"
              size="lg"
              label="Aku mau ini setiap hari →"
              onPress={() => router.push('/onboarding/paywall' as any)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
