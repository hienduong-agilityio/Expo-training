// Components
import { View, Text } from 'react-native';
import { Button } from '@app/components/common/Button';
import { PaymentMethodItem } from '@app/components/ui/PaymentMethodItem';

// Styles
import { styles } from './index.style';

// Types
import type { PaymentOption } from '@app/interfaces';
import type { PaymentProvider } from '@app/constants';

// Constants
import { PROVIDER_ICON_MAP } from '@app/constants';

interface IPaymentMethodsProps {
  title: string;
  options: PaymentOption[];
  selectedId?: PaymentProvider;
  onSelect?: (id: PaymentProvider) => void;
  onContinue?: () => void;
}

export const PaymentMethods = ({
  title = 'Payment',
  options,
  selectedId,
  onSelect,
  onContinue,
}: IPaymentMethodsProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>

      <View style={styles.list}>
        {options.map(option => {
          const Icon = PROVIDER_ICON_MAP[option.id];
          const isSelected = option.id === selectedId;

          return (
            <PaymentMethodItem
              key={option.id}
              Icon={Icon}
              label={option.maskedCardNumber}
              selected={isSelected}
              accessibilityLabel={`payment-option-${option.id}`}
              onPress={() => onSelect?.(option.id)}
            />
          );
        })}
      </View>

      <Button label="Continue" onPress={onContinue} fullWidth size="lg" />
    </View>
  );
};
