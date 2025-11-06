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
  quantity: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
}

export const CartItem = ({
  name,
  imageSource,
  price,
  quantity,
  onIncrease,
  onDecrease,
}: ICartItemProps) => {
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
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />
        </View>

        {/* Remove Button and Total */}
        <View style={styles.bottomRow}>
          <Button
            variant={BUTTON_VARIANTS.GHOST}
            style={styles.removeBtn}
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
};
