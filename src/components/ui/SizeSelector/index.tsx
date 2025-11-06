// Components
import { View, Text } from 'react-native';
import { Button } from '@app/components/common/Button';

// Types
import type { IProductSize } from '@app/interfaces';

// Styles
import { styles } from './index.style';

interface ISizeSelectorProps {
  sizes: IProductSize[];
  selectedSize?: string;
  onSizeSelect: (sizeId: string) => void;
}

export const SizeSelector = ({
  sizes,
  selectedSize,
  onSizeSelect,
}: ISizeSelectorProps) => {
  const handleSizeSelect = (size: IProductSize) => {
    onSizeSelect(size.id);
  };

  return (
    <View style={styles.container} accessibilityLabel="Size selector">
      <Text
        style={styles.title}
        accessibilityLabel={`Current selection: ${selectedSize}`}>
        {selectedSize}
      </Text>

      <View style={styles.sizesContainer}>
        {sizes.map(size => {
          const isSelected = selectedSize === size.size;
          const isDisabled = !size.available;

          return (
            <Button
              key={size.id}
              style={[
                styles.sizeButton,
                isSelected && styles.selectedSizeButton,
                isDisabled && styles.disabledSizeButton,
              ]}
              onPress={() => handleSizeSelect(size)}
              disabled={isDisabled}
              accessibilityRole="button"
              accessibilityLabel={`Size ${size.size}`}
              accessibilityState={{
                disabled: isDisabled,
                selected: isSelected,
              }}
              testID={`size-btn-${size.size}`}>
              <Text
                style={[
                  styles.sizeText,
                  isSelected && styles.selectedSizeText,
                  isDisabled && styles.disabledSizeText,
                ]}>
                {size.size}
              </Text>
            </Button>
          );
        })}
      </View>
    </View>
  );
};
