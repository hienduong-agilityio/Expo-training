import { memo, useCallback } from 'react';

// Components
import { View, Text } from 'react-native';
import { FallbackImage } from '@app/components/common/FallbackImage';
import { Price } from '@app/components/common/Price';
import { Button } from '@app/components/common/Button';
import { Quantity } from '@app/components/ui/Quantity';

// Types
import type { IProduct } from '@app/interfaces';

// Styles
import { styles } from './index.style';

// Enums
import { BUTTON_VARIANTS } from '@app/enums';

interface ICartItemProps extends IProduct {
  id: string;
  quantity: number;
  onIncrease: (id: string, quantity: number) => void;
  onDecrease: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}
export const CartItem = memo(function CartItem({
  id,
  name,
  imageSource,
  price,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: ICartItemProps) {
  const handleIncrease = useCallback(() => {
    onIncrease(id, quantity);
  }, [id, quantity, onIncrease]);

  const handleDecrease = useCallback(() => {
    onDecrease(id, quantity);
  }, [id, quantity, onDecrease]);

  const handleRemove = useCallback(() => {
    onRemove(id);
  }, [id, onRemove]);

  return (
    <View style={styles.card} accessibilityLabel="Cart item">
      {/* Image */}
      <FallbackImage
        source={imageSource}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        accessibilityLabel={`${name} image`}
      />

      {/* Info */}
      <View style={styles.info}>
        <Text
          style={styles.title}
          numberOfLines={2}
          accessibilityLabel={`Product name: ${name}`}>
          {name}
        </Text>

        <View style={styles.priceRow}>
          <Price value={price} currency="INR" />
          <Text
            style={styles.quantityText}
            accessibilityLabel={`Quantity ${quantity}`}>
            Quantity: {quantity}
          </Text>
        </View>

        {/* Quantity Controls */}
        <View style={styles.quantitySection}>
          <Quantity
            value={quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        </View>

        {/* Remove Button and Total */}
        <View style={styles.bottomRow}>
          <Button
            variant={BUTTON_VARIANTS.GHOST}
            style={styles.removeBtn}
            onPress={handleRemove}
            accessibilityRole="button"
            accessibilityLabel="Remove item">
            <Text style={styles.removeText}>Remove</Text>
          </Button>

          <View style={styles.totalWrap}>
            <Text style={styles.totalLabel}>Total</Text>
            <Price value={price * quantity} currency="INR" />
          </View>
        </View>
      </View>
    </View>
  );
});
