import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Subscribes to Supabase auth state changes and syncs into useAuthStore.
 *
 * Uses onAuthStateChange as the single source of truth.
 * Supabase JS v2 fires INITIAL_SESSION synchronously on mount,
 * so a separate getSession() call is unnecessary and would cause
 * rapid double-fire of the routing effect in _layout.tsx.
 *
 * Read session/loading from useAuthStore — not from this hook's return value.
 * Cleans up the subscription on unmount.
 */
export function useAuth() {
  const { setSession, setRecoverySession } = useAuthStore();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      // Track recovery sessions separately — they must only access /auth/reset-password.
      if (event === 'PASSWORD_RECOVERY') {
        setRecoverySession(true);
      } else if (event === 'SIGNED_OUT') {
        setRecoverySession(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
}
