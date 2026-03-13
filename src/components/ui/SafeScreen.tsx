import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/lib/constants';

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Additional className for NativeWind */
  className?: string;
  /** Override background color */
  bg?: string;
}

/** Wraps screen content with safe area insets (LANDMINE 8 fix — edge-to-edge Android) */
export function SafeScreen({ children, style, className = '', bg }: SafeScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={`flex-1 ${className}`}
      style={[
        {
          backgroundColor: bg ?? COLORS.bgPrimary,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
