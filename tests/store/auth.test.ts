import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthStore } from '@/store/auth';

beforeEach(() => {
  // Reset to true initial state (loading: true, session: null)
  useAuthStore.setState({ session: null, loading: true, isAuthenticated: false });
});

describe('useAuthStore', () => {
  it('initialises with null session and loading true', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.session).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('setSession stores the session and sets loading false', () => {
    const { result } = renderHook(() => useAuthStore());
    const fakeSession = { user: { id: 'abc123' } } as any;
    act(() => { result.current.setSession(fakeSession); });
    expect(result.current.session).toEqual(fakeSession);
    expect(result.current.loading).toBe(false);
  });

  it('clearSession removes the session and sets loading false', () => {
    const { result } = renderHook(() => useAuthStore());
    const fakeSession = { user: { id: 'abc' } } as any;
    act(() => {
      result.current.setSession(fakeSession);
      result.current.clearSession();
    });
    expect(result.current.session).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('isAuthenticated returns true when session exists', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => { result.current.setSession({ user: { id: 'x' } } as any); });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('isAuthenticated returns false when no session', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => { result.current.clearSession(); });
    expect(result.current.isAuthenticated).toBe(false);
  });
});
