# T02: Navigation Shell (Expo Router Tabs + Screen Stubs)
Slice: M002/S01
Created: 2026-03-12

## Goal
Build the complete navigation structure using Expo Router v3 — root layout, 4-tab bar (Today, Journal, Insights, Profile), onboarding stack, and auth screen. All screens are stubs that display their name. Tab bar uses design tokens.

## Steps
1. Create `src/app/_layout.tsx` — root layout with SafeAreaProvider, font loading
2. Create `src/app/(tabs)/_layout.tsx` — tab bar with 4 tabs + design token colors
3. Create `src/app/(tabs)/index.tsx` — Today stub
4. Create `src/app/(tabs)/journal.tsx` — Journal stub
5. Create `src/app/(tabs)/insights.tsx` — Insights stub
6. Create `src/app/(tabs)/profile.tsx` — Profile stub
7. Create `src/app/onboarding/_layout.tsx` — onboarding stack navigator
8. Create `src/app/auth/login.tsx` — login stub screen
9. Create `src/components/ui/SafeScreen.tsx` — SafeAreaView wrapper component
10. Load Plus Jakarta Sans font via expo-font

## Must-Haves

### Truths
- [ ] Navigating between all 4 tabs works without errors
- [ ] Tab bar shows correct Indonesian labels: Hari Ini, Jurnal, Wawasan, Profil
- [ ] Active tab shows brand/primary color (#D4724A), inactive shows text/muted (#6E6E7E)
- [ ] All screens are wrapped in SafeScreen — no content hidden behind status bar
- [ ] Onboarding route group exists at `/onboarding`
- [ ] Auth route exists at `/auth/login`

### Artifacts
- [ ] `src/app/_layout.tsx` — exists, has SafeAreaProvider + Slot
- [ ] `src/app/(tabs)/_layout.tsx` — exists, 4 tabs with labels + icons
- [ ] `src/app/(tabs)/index.tsx` — exists, renders "Hari Ini" placeholder
- [ ] `src/app/(tabs)/journal.tsx` — exists, renders "Jurnal" placeholder
- [ ] `src/app/(tabs)/insights.tsx` — exists, renders "Wawasan" placeholder
- [ ] `src/app/(tabs)/profile.tsx` — exists, renders "Profil" placeholder
- [ ] `src/components/ui/SafeScreen.tsx` — exists, exports SafeScreen

### Key Links
- [ ] All 4 tab screens import and use `SafeScreen`
- [ ] Tab bar `activeTintColor` uses `COLORS.brandPrimary`
- [ ] Root layout loads `PlusJakartaSans_400Regular`, `PlusJakartaSans_600SemiBold`, `PlusJakartaSans_700Bold`

## File Templates

### src/app/_layout.tsx
```tsx
import 'react-native-url-polyfill/auto'; // Must be first
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Lora_400Regular } from '@expo-google-fonts/lora';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    Lora_400Regular,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
```

### src/app/(tabs)/_layout.tsx
```tsx
import { Tabs } from 'expo-router';
import { COLORS } from '@/lib/constants';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.brandPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
      }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Hari Ini',  tabBarIcon: ({ color }) => <TabIcon name="home" color={color} /> }} />
      <Tabs.Screen name="journal"  options={{ title: 'Jurnal',    tabBarIcon: ({ color }) => <TabIcon name="book" color={color} /> }} />
      <Tabs.Screen name="insights" options={{ title: 'Wawasan',   tabBarIcon: ({ color }) => <TabIcon name="chart" color={color} /> }} />
      <Tabs.Screen name="profile"  options={{ title: 'Profil',    tabBarIcon: ({ color }) => <TabIcon name="person" color={color} /> }} />
    </Tabs>
  );
}
```

### src/components/ui/SafeScreen.tsx
```tsx
import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/lib/constants';

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function SafeScreen({ children, style }: SafeScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        { flex: 1, backgroundColor: COLORS.bgPrimary, paddingTop: insets.top },
        style,
      ]}
    >
      {children}
    </View>
  );
}
```

## Notes
- Use `@expo-google-fonts/plus-jakarta-sans` and `@expo-google-fonts/lora` packages for fonts
- Tab icons: use `@expo/vector-icons` (Ionicons) — ships with Expo, no extra install
- `tsconfig.json` needs `"baseUrl": "."` and `"paths": { "@/*": ["src/*"] }` for `@/` imports
- Expo Router v3: file-based routing under `src/app/`. The `(tabs)` folder name creates a route group without adding to URL path.
