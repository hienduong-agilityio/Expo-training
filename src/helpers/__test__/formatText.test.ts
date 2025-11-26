import { getCurrencySymbol, formatCurrencyUnit } from '../formatText';
import { CurrencyCode } from '@app/helpers';

describe('formatText helpers', () => {
  describe('getCurrencySymbol', () => {
    it('returns $ for USD', () => {
      expect(getCurrencySymbol('USD')).toBe('$');
    });

    it('returns ₹ for INR', () => {
      expect(getCurrencySymbol('INR')).toBe('₹');
    });

    it('returns currency code for unknown currency', () => {
      expect(getCurrencySymbol('EUR' as unknown as CurrencyCode)).toBe('EUR');
    });
  });

  describe('formatCurrencyUnit', () => {
    it('formats number with USD', () => {
      expect(formatCurrencyUnit(100, 'USD')).toBe('$ 100');
    });

    it('formats number with INR', () => {
      expect(formatCurrencyUnit(500, 'INR')).toBe('₹ 500');
    });

    it('formats string value', () => {
      expect(formatCurrencyUnit('1000', 'USD')).toBe('$ 1000');
    });
  });
});
