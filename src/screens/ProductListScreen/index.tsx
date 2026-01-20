import { useCallback, useMemo, useLayoutEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

// Types
import type { PrivateStackScreenProps } from '@app/interfaces/navigation';
import type { ProductListType } from '@app/constants';
import type { IProduct } from '@app/interfaces/product';

// Constants
import { PRIVATE_SCREENS, PRODUCT_LIST_TYPES } from '@app/constants';

// Hooks
import {
  useCategorizedProducts,
  useInfiniteProducts,
} from '@app/hooks/useProduct';

// Helpers
import { getProductsByListType } from '@app/helpers/products';

// Components
import { GridProductList } from '@app/components/ui/ProductList';

// Styles
import { styles } from './index.style';

type ProductListScreenProps = PrivateStackScreenProps<
  typeof PRIVATE_SCREENS.PRODUCT_LIST
>;

export const ProductListScreen = ({
  route,
  navigation,
}: ProductListScreenProps) => {
  const { type: productListType, title } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || 'Products',
    });
  }, [navigation, title]);

  const isCategorized = useMemo(() => {
    return (
      [
        PRODUCT_LIST_TYPES.TRENDING,
        PRODUCT_LIST_TYPES.DEALS,
        PRODUCT_LIST_TYPES.DEAL_OF_DAY,
        PRODUCT_LIST_TYPES.NEW_ARRIVALS,
      ] as ProductListType[]
    ).includes(productListType);
  }, [productListType]);

  const {
    data: categorizedData,
    isLoading: isCategorizedLoading,
    error: categorizedError,
    refetch: refetchCategorized,
  } = useCategorizedProducts({ enabled: isCategorized });

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInfiniteLoading,
    error: infiniteError,
    refetch: refetchInfinite,
  } = useInfiniteProducts(10, { enabled: !isCategorized });

  const isLoading = useMemo(
    () => (isCategorized ? isCategorizedLoading : isInfiniteLoading),
    [isCategorized, isCategorizedLoading, isInfiniteLoading],
  );

  const error = useMemo(
    () => (isCategorized ? categorizedError : infiniteError),
    [isCategorized, categorizedError, infiniteError],
  );

  const products = useMemo(() => {
    if (isCategorized) {
      return getProductsByListType(productListType, categorizedData);
    }

    return (
      infiniteData?.pages.flatMap((page: { data: IProduct[] }) => page.data) ??
      []
    );
  }, [isCategorized, productListType, categorizedData, infiniteData]);

  const onEndReached = useMemo(
    () => (isCategorized ? undefined : fetchNextPage),
    [isCategorized, fetchNextPage],
  );

  const isLoadingMore = useMemo(
    () => (isCategorized ? false : isFetchingNextPage),
    [isCategorized, isFetchingNextPage],
  );

  const hasMore = useMemo(
    () => (isCategorized ? false : hasNextPage),
    [isCategorized, hasNextPage],
  );

  const refreshing = useMemo(
    () => isLoading && products.length > 0,
    [isLoading, products.length],
  );

  const handleItemPress = useCallback(
    (id: string) => {
      navigation.navigate(PRIVATE_SCREENS.PRODUCT_DETAIL, { productId: id });
    },
    [navigation],
  );

  const handleRefresh = useCallback(() => {
    if (isCategorized) {
      refetchCategorized();
    } else {
      refetchInfinite();
    }
  }, [isCategorized, refetchCategorized, refetchInfinite]);

  if (isLoading && !products.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error && !products.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Something went wrong. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GridProductList
        products={products}
        onItemPress={handleItemPress}
        numColumns={2}
        onEndReached={onEndReached}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};
