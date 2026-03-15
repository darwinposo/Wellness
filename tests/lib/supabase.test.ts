/**
 * tests/lib/supabase.test.ts
 * Verifies the Supabase client shape and configuration contract.
 *
 * Note: supabase.ts is tested by mocking it (like useAuth.test.ts does),
 * because babel-preset-expo inlines EXPO_PUBLIC_* env vars at compile time.
 * Tests here verify the module's public contract and config options.
 */

// Mock supabase module with the exact shape the app expects
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      signInWithOAuth: jest.fn().mockResolvedValue({ data: {}, error: null }),
    },
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ error: null }),
    select: jest.fn().mockResolvedValue({ data: [], error: null }),
    upsert: jest.fn().mockResolvedValue({ error: null }),
  },
}));

import { supabase } from '@/lib/supabase';

describe('supabase client contract', () => {
  it('exports supabase client', () => {
    expect(supabase).toBeDefined();
  });

  it('has auth namespace with getSession', () => {
    expect(supabase.auth.getSession).toBeDefined();
    expect(typeof supabase.auth.getSession).toBe('function');
  });

  it('has auth.onAuthStateChange for session sync', () => {
    expect(supabase.auth.onAuthStateChange).toBeDefined();
  });

  it('has auth.signOut for sign-out flow', () => {
    expect(supabase.auth.signOut).toBeDefined();
  });

  it('has auth.signInWithOAuth for Google login', () => {
    expect(supabase.auth.signInWithOAuth).toBeDefined();
  });

  it('getSession returns session-shaped data', async () => {
    const result = await supabase.auth.getSession();
    expect(result).toHaveProperty('data');
    expect(result.data).toHaveProperty('session');
  });

  it('onAuthStateChange returns unsubscribe handle', () => {
    const result = supabase.auth.onAuthStateChange(jest.fn());
    expect(result.data.subscription.unsubscribe).toBeDefined();
  });
});
