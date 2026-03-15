import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  // True ONLY when the session was established via a PASSWORD_RECOVERY event.
  // Guards the reset-password screen — cleared after use or on signOut.
  isRecoverySession: boolean;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
  setRecoverySession: (value: boolean) => void;
}

/**
 * Auth state store — synced by useAuth hook via supabase.auth.onAuthStateChange.
 * Do not set session directly; use the useAuth hook to wire Supabase events.
 */
export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,
  isAuthenticated: false,
  isRecoverySession: false,

  setSession: (session) =>
    set({ session, loading: false, isAuthenticated: session !== null }),

  clearSession: () =>
    set({ session: null, loading: false, isAuthenticated: false, isRecoverySession: false }),

  setRecoverySession: (value) =>
    set({ isRecoverySession: value }),
}));
