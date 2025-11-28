import { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';

// Icons
import { CartIcon, HeartIcon } from '@app/icons';

// Themes
import { colors } from '@app/themes';

// Constants
import {
  POSITION,
  PRIVATE_SCREENS,
  STATUS,
  TOAST_MESSAGES,
} from '@app/constants';

// Types
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PrivateStackParamList } from '@app/interfaces/navigation';

// Styles
import { styles } from './index.style';

// Hooks
import { useWishlist } from '@app/hooks/useWishlist';

// Stores
import { toastStore } from '@app/stores/toastStore';

export const ProductDetailHeaderRight = ({
  navigation,
  productId,
}: {
  productId: string;
  navigation: NativeStackNavigationProp<PrivateStackParamList>;
}) => {
  const showToast = toastStore(state => state.showToast);

  const { isInWishlist, addItem, removeItem } = useWishlist();

  const isWishlisted = isInWishlist(productId);

  const handleToggleWishlist = useCallback(
    async (productIdToToggle: string) => {
      if (isInWishlist(productIdToToggle)) {
        await removeItem(productIdToToggle);

        showToast({
          type: STATUS.SUCCESS,
          message: TOAST_MESSAGES.REMOVED_FROM_WISHLIST,
          position: POSITION.TOP,
        });
      } else {
        await addItem(productIdToToggle);

        showToast({
          type: STATUS.SUCCESS,
          message: TOAST_MESSAGES.ADDED_TO_WISHLIST,
          position: POSITION.TOP,
        });
      }
    },
    [isInWishlist, addItem, removeItem, showToast],
  );

  const handleCartPress = () => {
    navigation.navigate(PRIVATE_SCREENS.HOME, {
      screen: PRIVATE_SCREENS.CART,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleToggleWishlist(productId)}
        style={styles.iconButton}
        accessibilityRole="button">
        <HeartIcon
          width={24}
          height={24}
          color={isWishlisted ? colors.primary : colors.text}
          filled={isWishlisted}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleCartPress}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="Go to cart">
        <CartIcon width={24} height={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};
