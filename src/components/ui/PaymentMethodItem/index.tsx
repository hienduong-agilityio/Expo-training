import type { ComponentType } from 'react';

// Types
import type { IconProps } from '@app/interfaces';

// Components
import { View, Text, TouchableOpacity } from 'react-native';

// Styles
import { styles } from './index.style';

// Themes
import { iconSize } from '@app/themes';

type IconComponent = ComponentType<IconProps>;

interface IPaymentMethodItemProps {
  Icon: IconComponent;
  label: string;
  selected?: boolean;
  accessibilityLabel?: string;
  onPress?: () => void;
}

export const PaymentMethodItem = ({
  Icon,
  label,
  selected = false,
  onPress,
  accessibilityLabel,
}: IPaymentMethodItemProps) => {
  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.container, selected && styles.selected]}
      accessibilityRole="button">
      <View style={styles.left}>
        <Icon size={iconSize['4xl']} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};
