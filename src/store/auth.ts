import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
}

/**
 * Auth state store — synced by useAuth hook via supabase.auth.onAuthStateChange.
 * Do not set session directly; use the useAuth hook to wire Supabase events.
 */
export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,
  isAuthenticated: false,

  setSession: (session) =>
    set({ session, loading: false, isAuthenticated: session !== null }),

  clearSession: () =>
    set({ session: null, loading: false, isAuthenticated: false }),
}));
