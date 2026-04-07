import { View, Text, TouchableOpacity } from 'react-native';

// Icons
import { CartIcon } from '@app/icons';

// Themes
import { colors } from '@app/themes';

// Styles
import { styles } from './index.style';

interface IProductActionsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  addToCartLoading?: boolean;
  buyNowLoading?: boolean;
}

export const ProductActions = ({
  onAddToCart,
  onBuyNow,
  addToCartLoading = false,
  buyNowLoading = false,
}: IProductActionsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.addToCartButton]}
        onPress={onAddToCart}
        disabled={addToCartLoading || buyNowLoading}
        activeOpacity={0.8}>
        <CartIcon width={20} height={20} color={colors.white} />
        <Text style={styles.addToCartText}>Go to cart</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buyNowButton]}
        onPress={onBuyNow}
        disabled={addToCartLoading || buyNowLoading}
        activeOpacity={0.8}>
        <Text style={styles.buyNowText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );
};
