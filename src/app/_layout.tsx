import 'react-native-url-polyfill/auto'; // LANDMINE 3: must be first import
import '../../global.css'; // NativeWind global styles
import { useEffect } from 'react';
import { Slot, useSegments, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Lora_400Regular } from '@expo-google-fonts/lora';
import * as SplashScreen from 'expo-splash-screen';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth';
import { COLORS } from '@/lib/constants';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    Lora_400Regular,
  });

  const { isComplete } = useOnboardingStore();
  useAuth(); // syncs Supabase session into useAuthStore
  const { session, loading: authLoading, isRecoverySession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (authLoading) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inAuth = segments[0] === 'auth';
    const inTabs = segments[0] === '(tabs)';
    const inCallback = segments[0] === 'auth' && segments[1] === 'callback';
    const inResetPassword = segments[0] === 'auth' && segments[1] === 'reset-password';

    // Recovery sessions are restricted — they may ONLY access reset-password.
    // Prevent a recovery link from granting full app access.
    if (session && isRecoverySession && !inResetPassword) {
      router.replace('/auth/reset-password' as any);
      return;
    }

    // Auth always comes first — unauthenticated users go to login before anything else
    if (!session && !inAuth) {
      router.replace('/auth/login' as any);
    } else if (session && (inCallback || inResetPassword)) {
      // Let callback.tsx / reset-password.tsx handle navigation — don't interfere
      return;
    } else if (session && !isComplete && !inOnboarding) {
      router.replace('/onboarding');
    } else if (session && isComplete && !inTabs) {
      router.replace('/(tabs)' as any);
    }
  }, [isComplete, session, authLoading, isRecoverySession, segments, router]);

  // Show spinner while Supabase resolves the existing session —
  // avoids flashing onboarding/login for returning users
  if (authLoading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgPrimary }}>
          <ActivityIndicator size="large" color={COLORS.brandPrimary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {/* Routing priority:
          1. Not authenticated → login (always first)
          2. Authenticated + onboarding incomplete → onboarding
          3. Authenticated + onboarding complete → main tabs  */}
      <Slot />
    </SafeAreaProvider>
  );
}
