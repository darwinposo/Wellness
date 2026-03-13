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

## COLORS from constants — established T02 M002/S01 (2026-03-12)
Never hardcode hex values. Always import from `@/lib/constants`.

```tsx
import { COLORS } from '@/lib/constants';

// ✅ Correct
tintColor: COLORS.brandPrimary

// ❌ Wrong
tintColor: '#D4724A'
```
