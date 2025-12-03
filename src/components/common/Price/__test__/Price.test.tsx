import { render, screen } from '@testing-library/react-native';

// Components
import { Price } from '../index';

// Types
import type { CurrencyCode } from '@app/helpers';

describe('Price', () => {
  it('renders component with snapshot', () => {
    const { toJSON } = render(<Price value={29.99} currency="USD" />);
    expect(toJSON()).toMatchSnapshot();
  });

  const currencyTestCases = [
    { value: 99.99, currency: 'USD' as CurrencyCode, expected: '$ 99.99' },
    { value: 1999, currency: 'INR' as CurrencyCode, expected: '₹ 1999.00' },
  ];

  test.each(currencyTestCases)(
    'formats $currency currency correctly',
    ({ value, currency, expected }) => {
      render(<Price value={value} currency={currency} />);
      expect(screen.getByText(expected)).toBeTruthy();
    },
  );

  it('handles zero values', () => {
    render(<Price value={0} currency="USD" />);
    expect(screen.getByText('$ 0.00')).toBeTruthy();
  });
});
