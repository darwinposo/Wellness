import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * Subscribes to Supabase auth state changes and syncs into useAuthStore.
 * Handles initial session fetch + real-time auth events (sign-in, sign-out, token refresh).
 * Read session/loading from useAuthStore — not from this hook's return value.
 * Cleans up the subscription on unmount.
 */
export function useAuth() {
  const { setSession } = useAuthStore();

  useEffect(() => {
    // Fetch existing session on mount (handles app restart with persisted session)
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch(() => {
        // Supabase not configured or network error — treat as no session
        setSession(null);
      });

    // Subscribe to auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
}
