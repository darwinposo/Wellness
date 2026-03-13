import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '@/lib/constants';

interface PricingCardProps {
  price: string;
  sublabel?: string;
  isRecommended: boolean;
  isSelected?: boolean;
  onPress: () => void;
}

/**
 * Pricing tier card for the onboarding paywall.
 * Annual plan shows "PALING HEMAT" badge and brand-primary border.
 */
export function PricingCard({ price, sublabel, isRecommended, isSelected, onPress }: PricingCardProps) {
  const highlighted = isSelected;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: COLORS.surface,
          borderRadius: SPACING.cardRadius,
          padding: SPACING.cardPadding,
          borderWidth: 2,
          borderColor: highlighted ? COLORS.brandPrimary : COLORS.border,
        },
        highlighted ? {} : SHADOWS.card,
      ]}
    >
      {isRecommended && (
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: COLORS.brandPrimary,
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 3,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontFamily: FONTS.sansBold, color: '#fff', fontSize: 10, letterSpacing: 0.5 }}>
            PALING HEMAT
          </Text>
        </View>
      )}

      <Text style={{ fontFamily: FONTS.sansBold, color: COLORS.textPrimary, fontSize: 18 }}>
        {price}
      </Text>

      {sublabel && (
        <Text style={{ fontFamily: FONTS.sans, color: COLORS.textMuted, fontSize: 13, marginTop: 2 }}>
          {sublabel}
        </Text>
      )}
    </TouchableOpacity>
  );
}
