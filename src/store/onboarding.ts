import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Goal = 'stress' | 'sleep' | 'happiness' | null;
export type Frequency = 'daily' | '4-5x' | '2-3x' | 'as-needed' | null;
export type TimePreference = 'morning' | 'midday' | 'afternoon' | 'night' | null;

interface OnboardingState {
  goal: Goal;
  frequency: Frequency;
  timePreference: TimePreference;
  isComplete: boolean;
  setGoal: (goal: Goal) => void;
  setFrequency: (freq: Frequency) => void;
  setTimePreference: (time: TimePreference) => void;
  complete: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      goal: null,
      frequency: null,
      timePreference: null,
      isComplete: false,
      setGoal: (goal) => set({ goal }),
      setFrequency: (frequency) => set({ frequency }),
      setTimePreference: (timePreference) => set({ timePreference }),
      complete: () => set({ isComplete: true }),
      reset: () => set({ goal: null, frequency: null, timePreference: null, isComplete: false }),
    }),
    {
      name: 'reflect-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
