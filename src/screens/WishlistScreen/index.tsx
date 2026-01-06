import { useCallback } from 'react';
import { View, RefreshControl } from 'react-native';

// Hooks
import { useWishlist, useWishlistActions } from '@app/hooks/useWishlist';
import { useProductsByIds } from '@app/hooks/useProduct';

// Stores
import { toastStore } from '@app/stores/toastStore';
import { modalStore } from '@app/stores/modalStore';

// Components
import { LoadingState } from '@app/components/ui/LoadingState';
import { NotFound } from '@app/components/ui/NotFound';
import { GridProductList } from '@app/components/ui/ProductList';

// Constants
import {
  POSITION,
  STATUS,
  TOAST_MESSAGES,
  WISHLIST_MESSAGES,
  PRIVATE_SCREENS,
  BUTTON_LABELS,
} from '@app/constants';

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
  const { wishlist, wishlistItems, isLoading, refetch } = useWishlist();

  const { removeItem, isMutating } = useWishlistActions();

  const productIds = wishlistItems.map(
    (item: IWishlistItem) => item.productId ?? '',
  );

  const { products, isLoading: isLoadingProducts } =
    useProductsByIds(productIds);

  const showToast = toastStore(state => state.showToast);
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

          showToast({
            type: STATUS.SUCCESS,
            message: TOAST_MESSAGES.REMOVED_FROM_WISHLIST,
            position: POSITION.TOP,
          });
        },
      });
    },
    [removeItem, showToast, showConfirm],
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
