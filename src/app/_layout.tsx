import 'react-native-url-polyfill/auto'; // LANDMINE 3: must be first import
import '../../global.css'; // NativeWind global styles
import { useEffect } from 'react';
import { Slot, Redirect } from 'expo-router';
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
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

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
          1. No onboarding completed → onboarding flow
          2. Not authenticated → login
          3. Authenticated → main tabs  */}
      {!isComplete && <Redirect href="/onboarding" />}
      {isComplete && !session && <Redirect href="/auth/login" />}
      <Slot />
    </SafeAreaProvider>
  );
}
