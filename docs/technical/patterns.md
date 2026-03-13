# Technical Patterns — Reflect

## SafeScreen — established T02 M002/S01 (2026-03-12)
Every screen wraps its content in `<SafeScreen>` from `@/components/ui`.
Never use bare `<View>` at the top level of a screen — it breaks edge-to-edge on Android.

```tsx
import { SafeScreen } from '@/components/ui';

export default function MyScreen() {
  return (
    <SafeScreen>
      {/* screen content */}
    </SafeScreen>
  );
}
```

---

## fontFamily via style prop — established T03 M002/S01 (2026-03-12)
NativeWind does not map custom font families via `className`. Always use `style` prop for font families.

```tsx
// ✅ Correct
<Text style={{ fontFamily: FONTS.sans }} className="text-base text-text-primary">
  Hello
</Text>

// ❌ Wrong — NativeWind ignores custom font family in className
<Text className="font-sans text-base text-text-primary">Hello</Text>
```

---

## className for tokens, style for platform-specific — established T03 M002/S01 (2026-03-12)
Split responsibility in React Native components:
- `className` → colors, spacing, border radius, text size (mapped to design tokens)
- `style` prop → font family, elevation/shadow (platform-specific)

---

## Barrel export from ui/index.ts — established T03 M002/S01 (2026-03-12)
All UI components exported from `src/components/ui/index.ts`.
Import path is always `@/components/ui` — never individual files.

```tsx
// ✅ Correct
import { Button, Card, SafeScreen } from '@/components/ui';

// ❌ Wrong
import Button from '@/components/ui/Button';
```

---

## Indonesian copy from day 1 — established T02 M002/S01 (2026-03-12)
All user-visible strings are in Bahasa Indonesia. Never ship English placeholder text.
Tab labels: Hari Ini, Jurnal, Wawasan, Profil.

---

## --legacy-peer-deps for all npm installs — established T01 M002/S01 (2026-03-12)
React 19 causes peer dep conflicts with Supabase, Reanimated, and others.
All `npm install` commands must include `--legacy-peer-deps`.

```bash
npm install <package> --legacy-peer-deps
```

---

## SelectionCard — established T01 M002/S02 (2026-03-13)
Interactive option card with selection state. Used in goal, frequency, time screens — reuse in M003 mood check-in.

```tsx
<TouchableOpacity
  onPress={() => setSelected(option.id)}
  style={[
    selected === option.id
      ? { borderWidth: 2, borderColor: COLORS.brandPrimary }
      : { ...SHADOWS.card }
  ]}
  className="rounded-xl p-4 bg-surface-primary mb-3"
>
  <Text>{option.label}</Text>
</TouchableOpacity>
```

---

## ScreenLayout — established T01 M002/S02 (2026-03-13)
Standard onboarding screen layout pattern: content area fills available space, bottom area fixed.

```tsx
<SafeScreen>
  <View className="flex-1 justify-between px-6 py-8">
    {/* content — flex-1 to fill */}
    <View className="flex-1">
      {/* ... */}
    </View>
    {/* bottom fixed: progress dots + CTA */}
    <View className="gap-6">
      <ProgressDots current={1} total={7} />
      <Button label="Lanjut" onPress={handleNext} disabled={!selected} />
    </View>
  </View>
</SafeScreen>
```

---

## Disabled CTA — established T01 M002/S02 (2026-03-13)
Pass `disabled` prop to Button — Button handles opacity internally. Never manually style opacity.

```tsx
<Button label="Lanjut" onPress={handleNext} disabled={!selectedValue} />
```

---

## Auth guard in root layout — established T03 M002/S02 (2026-03-13)
Routing decisions (onboarding / login / tabs) live in `_layout.tsx` via Expo Router `<Redirect>`.
Screens do not redirect themselves.

```tsx
// _layout.tsx
if (loading) return <LoadingSpinner />;
if (!isComplete) return <Redirect href="/onboarding" />;
if (!session) return <Redirect href="/auth/login" />;
return <Slot />;
```

---

## Zustand + AsyncStorage persistence — established T01 M002/S02 (2026-03-13)
Use `persist` middleware with `AsyncStorage` for any cross-session state.

```tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useMyStore = create(
  persist(
    (set) => ({ /* state */ }),
    { name: 'my-store', storage: createJSONStorage(() => AsyncStorage) }
  )
);
```

---

## Supabase auth hook — established T03 M002/S02 (2026-03-13)
Standard pattern for wiring Supabase auth to a Zustand store.

```tsx
export function useAuth() {
  const { setSession, setLoading } = useAuthStore();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
}
```

---

## Jest config for Expo SDK 55 — established T01 M002/S02 (2026-03-13)
`expo/src/winter` must be mocked via `moduleNameMapper` (not `setupFiles`).
Set `haste.defaultPlatform` to `'android'` for consistent resolution.

```js
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: { '^expo/src/winter$': '<rootDir>/tests/__mocks__/expo-winter.js' },
  haste: { defaultPlatform: 'android' },
};
```

---

## COLORS from constants — established T02 M002/S01 (2026-03-12)
Never hardcode hex values. Always import from `@/lib/constants`.

```tsx
import { COLORS } from '@/lib/constants';

// ✅ Correct
tintColor: COLORS.brandPrimary

// ❌ Wrong
tintColor: '#D4724A'
```
