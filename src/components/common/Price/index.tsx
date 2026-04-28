// Helpers
import { CurrencyCode, formatCurrencyUnit } from '@app/helpers';

// Components
import { Text } from 'react-native';

// Styles
import { styles } from './index.style';

export type PriceProps = {
  value: number;
  currency: CurrencyCode;
};

export const Price = ({ value, currency }: PriceProps) => {
  const formatted = formatCurrencyUnit(value, currency);

  return <Text style={styles.text}>{formatted}</Text>;
};
