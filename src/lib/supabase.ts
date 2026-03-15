import 'react-native-url-polyfill/auto'; // LANDMINE 3 FIX: must be first import
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder so app doesn't crash before .env is configured
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key';

/** Supabase client — configured with AsyncStorage adapter (LANDMINE 2 FIX)
 *  DO NOT use SecureStore — hard 2048-byte limit causes silent crash with Supabase JWTs
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,       // LANDMINE 2 FIX: AsyncStorage, not SecureStore
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',           // Required because Google login exchanges the auth code manually
  },
});
