export type CurrencyCode = 'USD' | 'INR';

export function getCurrencySymbol(currency: CurrencyCode): string {
  switch (currency) {
    case 'USD':
      return '$';
    case 'INR':
      return '₹';
    default:
      return currency;
  }
}

export function formatCurrencyUnit(
  value: string | number,
  currency: CurrencyCode,
): string {
  const symbol = getCurrencySymbol(currency);

  return `${symbol} ${String(value)}`;
}
