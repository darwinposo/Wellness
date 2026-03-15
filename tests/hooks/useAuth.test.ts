import { renderHook, act } from '@testing-library/react-hooks';

const mockUnsubscribe = jest.fn();
let authChangeCallback: (event: string, session: any) => void;
const mockOnAuthStateChange = jest.fn().mockImplementation((cb) => {
  authChangeCallback = cb;
  return {
    data: { subscription: { unsubscribe: mockUnsubscribe } },
  };
});

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      get onAuthStateChange() { return mockOnAuthStateChange; },
    },
  },
}));

import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth';

beforeEach(() => {
  jest.clearAllMocks();
  mockOnAuthStateChange.mockImplementation((cb) => {
    authChangeCallback = cb;
    return {
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    };
  });
  // Reset store to initial state
  useAuthStore.setState({ session: null, loading: true, isAuthenticated: false });
});

describe('useAuth', () => {
  it('store starts with loading true before onAuthStateChange fires', () => {
    renderHook(() => useAuth());
    expect(useAuthStore.getState().loading).toBe(true);
  });

  it('subscribes to auth state changes on mount', () => {
    renderHook(() => useAuth());
    expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
    expect(mockOnAuthStateChange).toHaveBeenCalledWith(expect.any(Function));
  });

  it('syncs null session when INITIAL_SESSION fires with no session', async () => {
    renderHook(() => useAuth());
    await act(async () => {
      authChangeCallback('INITIAL_SESSION', null);
    });
    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('syncs session when INITIAL_SESSION fires with a session', async () => {
    const fakeSession = { user: { id: 'user-1' }, access_token: 'token' } as any;
    renderHook(() => useAuth());
    await act(async () => {
      authChangeCallback('INITIAL_SESSION', fakeSession);
    });
    expect(useAuthStore.getState().session).toEqual(fakeSession);
    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('updates session on SIGNED_IN event', async () => {
    const fakeSession = { user: { id: 'user-2' }, access_token: 'tok2' } as any;
    renderHook(() => useAuth());
    await act(async () => {
      authChangeCallback('SIGNED_IN', fakeSession);
    });
    expect(useAuthStore.getState().session).toEqual(fakeSession);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('clears session on SIGNED_OUT event', async () => {
    // First sign in
    renderHook(() => useAuth());
    await act(async () => {
      authChangeCallback('SIGNED_IN', { user: { id: 'u' }, access_token: 't' });
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Then sign out
    await act(async () => {
      authChangeCallback('SIGNED_OUT', null);
    });
    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('calls unsubscribe on unmount', () => {
    const { unmount } = renderHook(() => useAuth());
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
