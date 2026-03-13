import React from 'react';
import { View } from 'react-native';
import { COLORS } from '@/lib/constants';

interface ProgressDotsProps {
  /** 1-based index of the current step */
  current: number;
  /** Total number of steps */
  total: number;
}

/**
 * Horizontal progress indicator for multi-step flows.
 * Completed dots are filled with brand-primary; current dot is brand-primary;
 * upcoming dots are light grey.
 */
export function ProgressDots({ current, total }: ProgressDotsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === current;
        const isCompleted = stepNumber < current;
        const color = isActive || isCompleted ? COLORS.brandPrimary : '#D1D5DB';
        const size = isActive ? 10 : 8;

        return (
          <View
            key={i}
            testID="progress-dot"
            accessibilityState={{ selected: isActive ? true : undefined }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            }}
          />
        );
      })}
    </View>
  );
}
