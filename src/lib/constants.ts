/** Design token constants — single source of truth for non-NativeWind usage */

export const COLORS = {
  bgPrimary:      '#FAF8F5',
  surface:        '#FFFFFF',
  brandPrimary:   '#D4724A',
  brandSecondary: '#4A7D8C',
  moodPositive:   '#7DB87A',
  moodNegative:   '#C4735A',
  textPrimary:    '#1A1A22',
  textMuted:      '#6E6E7E',
  border:         '#E2E2E8',
  error:          '#D94F4F',
  success:        '#3D9A5C',
} as const;

export const SPACING = {
  xs:           4,
  sm:           8,
  md:           16,
  lg:           24,
  xl:           32,
  xxl:          48,
  screenEdge:   24,
  cardPadding:  16,
  cardRadius:   16,
} as const;

export const FONTS = {
  sans:    'PlusJakartaSans_400Regular',
  sansSemi:'PlusJakartaSans_600SemiBold',
  sansBold:'PlusJakartaSans_700Bold',
  journal: 'Lora_400Regular',
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;
