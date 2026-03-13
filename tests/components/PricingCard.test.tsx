import React from 'react';
import { render } from '@testing-library/react-native';
import { PricingCard } from '@/components/ui/PricingCard';

describe('PricingCard', () => {
  it('renders the price text', () => {
    const { getByText } = render(
      <PricingCard price="Rp 299.000/tahun" isRecommended={false} onPress={() => {}} />
    );
    expect(getByText('Rp 299.000/tahun')).toBeTruthy();
  });

  it('shows PALING HEMAT badge when isRecommended is true', () => {
    const { getByText } = render(
      <PricingCard price="Rp 299.000/tahun" isRecommended={true} onPress={() => {}} />
    );
    expect(getByText('PALING HEMAT')).toBeTruthy();
  });

  it('does not show badge when isRecommended is false', () => {
    const { queryByText } = render(
      <PricingCard price="Rp 39.000/bulan" isRecommended={false} onPress={() => {}} />
    );
    expect(queryByText('PALING HEMAT')).toBeNull();
  });

  it('renders the sublabel when provided', () => {
    const { getByText } = render(
      <PricingCard
        price="Rp 299.000/tahun"
        sublabel="~Rp 24.900/bulan"
        isRecommended={true}
        onPress={() => {}}
      />
    );
    expect(getByText('~Rp 24.900/bulan')).toBeTruthy();
  });
});
