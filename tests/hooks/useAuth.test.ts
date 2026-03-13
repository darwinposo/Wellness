import { renderHook, act } from '@testing-library/react-hooks';

const mockUnsubscribe = jest.fn();
const mockGetSession = jest.fn().mockResolvedValue({ data: { session: null } });
const mockOnAuthStateChange = jest.fn().mockReturnValue({
  data: { subscription: { unsubscribe: mockUnsubscribe } },
});

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      get getSession() { return mockGetSession; },
      get onAuthStateChange() { return mockOnAuthStateChange; },
    },
  },
}));

import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth';

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSession.mockResolvedValue({ data: { session: null } });
  mockOnAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: mockUnsubscribe } },
  });
  // Reset store to initial state
  useAuthStore.setState({ session: null, loading: true, isAuthenticated: false });
});

describe('useAuth', () => {
  it('store starts with loading true before getSession resolves', () => {
    renderHook(() => useAuth());
    expect(useAuthStore.getState().loading).toBe(true);
  });

  it('syncs null session and loading false into store after getSession resolves', async () => {
    renderHook(() => useAuth());
    await act(async () => {});
    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('syncs session into store when getSession returns a session', async () => {
    const fakeSession = { user: { id: 'user-1' }, access_token: 'token' } as any;
    mockGetSession.mockResolvedValueOnce({ data: { session: fakeSession } });

    renderHook(() => useAuth());
    await act(async () => {});
    expect(useAuthStore.getState().session).toEqual(fakeSession);
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('subscribes to auth state changes on mount', async () => {
    renderHook(() => useAuth());
    await act(async () => {});
    expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
  });

  it('calls unsubscribe on unmount', async () => {
    const { unmount } = renderHook(() => useAuth());
    await act(async () => {});
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
