# T03: Design Token Integration (NativeWind + Global CSS)
Slice: M002/S01
Created: 2026-03-12

## Goal
Wire the design token system into the app — NativeWind configured with Reflect's semantic color tokens, global.css applied, and one real UI component (Button) built and rendering correctly on device to prove the token pipeline works end to end.

## Steps
1. Copy `design/tokens/tailwind.config.js` → project root `tailwind.config.js` (adapt for NativeWind)
2. Copy `design/tokens/global.css` → project root `global.css`
3. Create `babel.config.js` with NativeWind plugin
4. Create `src/components/ui/Button.tsx` — Primary, Secondary, Ghost variants
5. Create `src/components/ui/Card.tsx` — base card with shadow
6. Update one stub screen (Today) to show Button in brand/primary color
7. Run on device — confirm terracotta (#D4724A) renders correctly
8. Run `npx expo start --clear` to verify no NativeWind hot reload issues

## Must-Haves

### Truths
- [ ] `className="bg-brand-primary"` renders #D4724A on device
- [ ] `className="text-text-primary"` renders #1A1A22
- [ ] Button Primary variant shows brand/primary background, white text
- [ ] Card component shows 0 4px 16px shadow on Android
- [ ] No NativeWind babel errors on start

### Artifacts
- [ ] `tailwind.config.js` — at project root, extends colors with COLORS tokens
- [ ] `global.css` — at project root, imported in root layout
- [ ] `babel.config.js` — includes NativeWind plugin
- [ ] `src/components/ui/Button.tsx` — exists, exports Button, 3 variants
- [ ] `src/components/ui/Card.tsx` — exists, exports Card

### Key Links
- [ ] `global.css` is imported in `src/app/_layout.tsx`
- [ ] `tailwind.config.js` content array includes `./src/**/*.{ts,tsx}`
- [ ] Button uses `className` (not StyleSheet) for all styling

## File Templates

### tailwind.config.js (NativeWind adaptation)
```js
const { COLORS, SPACING } = require('./src/lib/constants');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'bg-primary':       COLORS.bgPrimary,
        'surface':          COLORS.surface,
        'brand-primary':    COLORS.brandPrimary,
        'brand-secondary':  COLORS.brandSecondary,
        'mood-positive':    COLORS.moodPositive,
        'mood-negative':    COLORS.moodNegative,
        'text-primary':     COLORS.textPrimary,
        'text-muted':       COLORS.textMuted,
        'border-color':     COLORS.border,
        'error':            COLORS.error,
        'success':          COLORS.success,
      },
      borderRadius: { card: '16px' },
      spacing: {
        'screen-edge': '24px',
        'card-pad': '16px',
      },
    },
  },
  plugins: [],
};
```

### babel.config.js
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
```

### src/components/ui/Button.tsx
```tsx
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';

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
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-brand-primary border-transparent',
  secondary: 'bg-transparent border border-brand-primary',
  ghost:     'bg-transparent border-transparent',
};

const textClasses: Record<ButtonVariant, string> = {
  primary:   'text-white',
  secondary: 'text-brand-primary',
  ghost:     'text-text-primary',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 rounded-xl',
  md: 'h-11 px-5 rounded-xl',
  lg: 'h-[52px] px-6 rounded-xl',
};

export function Button({
  label, onPress, variant = 'primary', size = 'lg',
  loading = false, disabled = false, fullWidth = true,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={[
        'flex-row items-center justify-center',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-40' : '',
      ].join(' ')}
      activeOpacity={0.85}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? '#fff' : '#D4724A'} />
        : <Text className={`font-semibold text-base ${textClasses[variant]}`}>{label}</Text>
      }
    </TouchableOpacity>
  );
}
```

### src/components/ui/Card.tsx
```tsx
import { View, ViewStyle } from 'react-native';
import { COLORS } from '@/lib/constants';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <View
      className={`bg-surface rounded-card p-card-pad ${className}`}
      style={[{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 16,
        elevation: 4, // Android shadow
      }, style]}
    >
      {children}
    </View>
  );
}
```

## Notes
- `presets: [require('nativewind/preset')]` replaces the old `plugins: ['nativewind/babel']` in tailwind config
- Android shadow requires `elevation` (not shadowColor/shadowOffset) — Card.tsx uses both for cross-platform
- After any change to `tailwind.config.js`, restart bundler with `--clear`
- If NativeWind hot reload fails for a new className: restart expo, it's a known SDK 53 quirk (Landmine 6)
