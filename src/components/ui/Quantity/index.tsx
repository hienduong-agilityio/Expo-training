import { View, Text, Pressable } from 'react-native';

// Styles
import { styles } from './index.style';

interface IQuantityProps {
  value: number;
  min?: number;
  max?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
}

export const Quantity = ({
  value,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  onIncrease,
  onDecrease,
}: IQuantityProps) => {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View style={styles.stepper} accessibilityLabel="Quantity stepper">
      <Pressable
        style={({ pressed }) => [
          styles.stepBtn,
          pressed && styles.pressed,
          !canDecrease && styles.disabledBtn,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        accessibilityState={{ disabled: !canDecrease }}
        disabled={!canDecrease}
        onPress={onDecrease}>
        <Text style={[styles.stepText, !canDecrease && styles.disabledText]}>
          −
        </Text>
      </Pressable>

      <Text
        style={styles.quantityValue}
        accessibilityLabel={`Quantity value ${value}`}>
        {value}
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.stepBtn,
          pressed && styles.pressed,
          !canIncrease && styles.disabledBtn,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        accessibilityState={{ disabled: !canIncrease }}
        disabled={!canIncrease}
        onPress={onIncrease}>
        <Text style={[styles.stepText, !canIncrease && styles.disabledText]}>
          ＋
        </Text>
      </Pressable>
    </View>
  );
};
