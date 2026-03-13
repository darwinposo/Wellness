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

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSession.mockResolvedValue({ data: { session: null } });
  mockOnAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: mockUnsubscribe } },
  });
});

describe('useAuth', () => {
  it('returns loading true before getSession resolves', () => {
    // Don't await — check synchronous initial state
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
  });

  it('returns session null and loading false after getSession resolves with no session', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {});
    expect(result.current.session).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets session when getSession returns a session', async () => {
    const fakeSession = { user: { id: 'user-1' }, access_token: 'token' } as any;
    mockGetSession.mockResolvedValueOnce({ data: { session: fakeSession } });

    const { result } = renderHook(() => useAuth());
    await act(async () => {});
    expect(result.current.session).toEqual(fakeSession);
    expect(result.current.loading).toBe(false);
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
