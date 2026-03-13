import { renderHook, act } from '@testing-library/react-hooks';
import { useOnboardingStore } from '@/store/onboarding';

// Reset store between tests
beforeEach(() => {
  useOnboardingStore.getState().reset();
});

describe('useOnboardingStore', () => {
  it('initialises with all fields null and isComplete false', () => {
    const { result } = renderHook(() => useOnboardingStore());
    expect(result.current.goal).toBeNull();
    expect(result.current.frequency).toBeNull();
    expect(result.current.timePreference).toBeNull();
    expect(result.current.isComplete).toBe(false);
  });

  it('setGoal stores the selected goal', () => {
    const { result } = renderHook(() => useOnboardingStore());
    act(() => { result.current.setGoal('stress'); });
    expect(result.current.goal).toBe('stress');
  });

  it('setFrequency stores the selected frequency', () => {
    const { result } = renderHook(() => useOnboardingStore());
    act(() => { result.current.setFrequency('daily'); });
    expect(result.current.frequency).toBe('daily');
  });

  it('setTimePreference stores the selected time', () => {
    const { result } = renderHook(() => useOnboardingStore());
    act(() => { result.current.setTimePreference('morning'); });
    expect(result.current.timePreference).toBe('morning');
  });

  it('complete() sets isComplete to true', () => {
    const { result } = renderHook(() => useOnboardingStore());
    act(() => { result.current.complete(); });
    expect(result.current.isComplete).toBe(true);
  });

  it('reset() clears all state back to initial', () => {
    const { result } = renderHook(() => useOnboardingStore());
    act(() => {
      result.current.setGoal('sleep');
      result.current.setFrequency('4-5x');
      result.current.complete();
      result.current.reset();
    });
    expect(result.current.goal).toBeNull();
    expect(result.current.frequency).toBeNull();
    expect(result.current.isComplete).toBe(false);
  });

  it('exports correct type literals for Goal', () => {
    const { result } = renderHook(() => useOnboardingStore());
    act(() => { result.current.setGoal('happiness'); });
    expect(result.current.goal).toBe('happiness');
  });
});
