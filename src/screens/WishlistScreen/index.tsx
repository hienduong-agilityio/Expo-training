import { useCallback, useMemo } from 'react';
import { View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';

// Hooks
import { useWishlist, useWishlistActions } from '@app/hooks/useWishlist';
import { useProductsByIds } from '@app/hooks/useProduct';

// Stores
import { modalStore } from '@app/stores/modalStore';

// Components
import { LoadingState } from '@app/components/ui/LoadingState';
import { NotFound } from '@app/components/ui/NotFound';
import { GridProductList } from '@app/components/ui/ProductList';

// Constants
import { WISHLIST_MESSAGES, BUTTON_LABELS } from '@app/constants';

// Types
import type { IProduct } from '@app/interfaces/product';
import type { IWishlistItem } from '@app/interfaces/wishlist';

// Styles
import { styles } from './index.style';

export const WishlistScreen = () => {
  const router = useRouter();
  const { wishlist, wishlistItems, isLoading, refetch } = useWishlist();

  const { removeItem, isMutating } = useWishlistActions();

  const productIds = useMemo(
    () => wishlistItems.map((item: IWishlistItem) => item.productId ?? ''),
    [wishlistItems],
  );

  const { products, isLoading: isLoadingProducts } =
    useProductsByIds(productIds);

  const showConfirm = modalStore(state => state.showConfirm);

  const hasWishlistItems = wishlist && wishlistItems.length > 0;

  const handleRemoveFromWishlist = useCallback(
    (productId: string) => {
      showConfirm({
        title: WISHLIST_MESSAGES.REMOVE_TITLE,
        message: WISHLIST_MESSAGES.REMOVE_MESSAGE,
        confirmLabel: BUTTON_LABELS.REMOVE,
        cancelLabel: BUTTON_LABELS.CANCEL,
        isDestructive: true,
        onConfirm: async () => {
          await removeItem(productId);
        },
      });
    },
    [removeItem, showConfirm],
  );

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const wishlistProducts = useMemo(
    () =>
      products.map((product: IProduct) => ({
        ...product,
        isWishlisted: true,
      })),
    [products],
  );

  const refreshing = isLoading || isMutating;

  if (isLoading || isLoadingProducts) {
    return (
      <View style={styles.container}>
        <LoadingState message={WISHLIST_MESSAGES.LOADING} />
      </View>
    );
  }

  if (!hasWishlistItems) {
    return (
      <View style={styles.container}>
        <NotFound
          title={WISHLIST_MESSAGES.EMPTY_TITLE}
          description={WISHLIST_MESSAGES.EMPTY_DESCRIPTION}
        />
      </View>
    );
  }

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
