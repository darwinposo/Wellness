import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const containerClass: Record<ButtonVariant, string> = {
  primary:   'bg-brand-primary border-transparent',
  secondary: 'bg-transparent border border-brand-primary',
  ghost:     'bg-transparent border-transparent',
};

const labelClass: Record<ButtonVariant, string> = {
  primary:   'text-white',
  secondary: 'text-brand-primary',
  ghost:     'text-text-primary',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 rounded-xl',
  md: 'h-11 px-5 rounded-xl',
  lg: 'h-[52px] px-6 rounded-xl',
};

const labelSizeClass: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-base',
};

/** Primary UI button — 3 variants (primary, secondary, ghost), 3 sizes */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={style}
      className={[
        'flex-row items-center justify-center',
        containerClass[variant],
        sizeClass[size],
        fullWidth ? 'w-full' : 'self-start',
        isDisabled ? 'opacity-40' : 'opacity-100',
      ].join(' ')}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#D4724A'}
        />
      ) : (
        <Text
          className={[
            'font-semibold',
            labelClass[variant],
            labelSizeClass[size],
          ].join(' ')}
          style={{ fontFamily: 'PlusJakartaSans_600SemiBold' }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
