import { useCallback } from 'react';
import { View, RefreshControl } from 'react-native';

// Hooks
import { useWishlist } from '@app/hooks/useWishlist';
import { useProductsByIds } from '@app/hooks/useProduct';

// Stores
import { toastStore } from '@app/stores/toastStore';

// Components
import { LoadingState } from '@app/components/ui/LoadingState';
import { NotFound } from '@app/components/ui/NotFound';
import { GridProductList } from '@app/components/ui/ProductList';

// Constants
import { POSITION, STATUS, TOAST_MESSAGES } from '@app/constants';
import { PRIVATE_SCREENS } from '@app/constants';

// Types
import type {
  PrivateStackParamList,
  PrivateTabParamList,
} from '@app/interfaces/navigation';
import type { IProduct } from '@app/interfaces/product';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { IWishlistItem } from '@app/interfaces/wishlist';

// Styles
import { styles } from './index.style';

type Props = CompositeScreenProps<
  BottomTabScreenProps<PrivateTabParamList, typeof PRIVATE_SCREENS.WISHLIST>,
  NativeStackScreenProps<PrivateStackParamList>
>;

export const WishlistScreen = ({ navigation }: Props) => {
  const { showToast } = toastStore();
  const {
    wishlist,
    wishlistItems,
    isLoading,
    isMutating,
    refetch,
    removeItem,
  } = useWishlist();

  const productIds = wishlistItems.map(
    (item: IWishlistItem) => item.productId ?? '',
  );
  const { products, isLoading: isLoadingProducts } =
    useProductsByIds(productIds);

  const hasWishlistItems = wishlist && wishlistItems.length > 0;

  const handleRemoveFromWishlist = useCallback(
    async (productId: string) => {
      await removeItem(productId);

      showToast({
        type: STATUS.SUCCESS,
        message: TOAST_MESSAGES.REMOVED_FROM_WISHLIST,
        position: POSITION.TOP,
      });
    },
    [removeItem, showToast],
  );

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation
        .getParent()
        ?.navigate(PRIVATE_SCREENS.PRODUCT_DETAIL, { productId });
    },
    [navigation],
  );

  if (isLoading || isLoadingProducts) {
    return (
      <View style={styles.container}>
        <LoadingState message="Loading wishlist..." />
      </View>
    );
  }

  if (!hasWishlistItems) {
    return (
      <View style={styles.container}>
        <NotFound
          title="Your wishlist is empty"
          description="Save products you love to see them here"
        />
      </View>
    );
  }

  const refreshing = isLoading || isMutating;

  const wishlistProducts = products.map((product: IProduct) => ({
    ...product,
    isWishlisted: true,
  }));

  return (
    <View style={styles.container}>
      <GridProductList
        products={wishlistProducts}
        onItemPress={handleProductPress}
        onWishlistToggle={handleRemoveFromWishlist}
        numColumns={2}
        contentPadding={16}
        gap={12}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refetch} />
        }
      />
    </View>
  );
};
