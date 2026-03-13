import React from 'react';
import { render } from '@testing-library/react-native';
import { ProgressDots } from '@/components/ui/ProgressDots';

describe('ProgressDots', () => {
  it('renders the correct total number of dots', () => {
    const { getAllByTestId } = render(<ProgressDots current={1} total={7} />);
    expect(getAllByTestId('progress-dot')).toHaveLength(7);
  });

  it('marks the current dot as active', () => {
    const { getAllByTestId } = render(<ProgressDots current={3} total={7} />);
    const dots = getAllByTestId('progress-dot');
    // dot at index 2 (0-based) should be active
    expect(dots[2].props.accessibilityState?.selected).toBe(true);
  });

  it('marks previous dots as completed (not active)', () => {
    const { getAllByTestId } = render(<ProgressDots current={4} total={7} />);
    const dots = getAllByTestId('progress-dot');
    // dots 0-2 are completed, dot 3 is active
    expect(dots[0].props.accessibilityState?.selected).toBeFalsy();
    expect(dots[3].props.accessibilityState?.selected).toBe(true);
  });
});
