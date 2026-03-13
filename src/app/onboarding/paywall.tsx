import { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { SafeScreen } from '@/components/ui/SafeScreen';
import { Button } from '@/components/ui/Button';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { PricingCard } from '@/components/ui/PricingCard';
import { useOnboardingStore } from '@/store/onboarding';
import { COLORS, FONTS } from '@/lib/constants';

/** Onboarding Screen 7 — Paywall (UI only — RevenueCat wired in M004) */
export default function OnboardingPaywall() {
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const { complete } = useOnboardingStore();

  /** Mark onboarding done THEN navigate — so root layout routes to tabs after auth */
  function handleContinue() {
    complete();
    router.push('/auth/login' as any);
  }

  return (
    <SafeScreen>
      <View className="flex-1 justify-between px-6 py-8">
        <View className="flex-1">
          {/* Header */}
          <View className="mb-6">
            <Text
              style={{ fontFamily: FONTS.journal, color: COLORS.textPrimary, fontSize: 28, lineHeight: 36 }}
              className="mb-2"
            >
              Mulai perjalananmu
            </Text>
            <Text style={{ fontFamily: FONTS.sans, color: COLORS.textMuted, fontSize: 15 }}>
              Coba gratis 7 hari, batalkan kapan saja.
            </Text>
          </View>

          {/* Pricing cards */}
          <View className="gap-3">
            <PricingCard
              price="Rp 299.000/tahun"
              sublabel="~Rp 24.900/bulan"
              isRecommended={true}
              isSelected={selectedPlan === 'annual'}
              onPress={() => setSelectedPlan('annual')}
            />
            <PricingCard
              price="Rp 39.000/bulan"
              isRecommended={false}
              isSelected={selectedPlan === 'monthly'}
              onPress={() => setSelectedPlan('monthly')}
            />
          </View>

          {/* Fine print */}
          <Text
            style={{
              fontFamily: FONTS.sans,
              color: COLORS.textMuted,
              fontSize: 12,
              textAlign: 'center',
              marginTop: 12,
            }}
          >
            Tidak perlu kartu kredit untuk mencoba.
          </Text>
        </View>

        {/* CTAs */}
        <View className="gap-6">
          <ProgressDots current={7} total={7} />
          <View className="gap-3">
            <Button
              variant="primary"
              size="lg"
              label="Coba Premium Gratis 7 Hari"
              onPress={handleContinue}
            />
            <Button
              variant="ghost"
              size="lg"
              label="Mulai Gratis (3 sesi/minggu)"
              onPress={handleContinue}
            />
          </View>
        </View>
      </View>
    </SafeScreen>
  );
}
