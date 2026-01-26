import { useLayoutEffect, useMemo } from 'react';
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

  const isCategorized = (
    [
      PRODUCT_LIST_TYPES.TRENDING,
      PRODUCT_LIST_TYPES.DEALS,
      PRODUCT_LIST_TYPES.DEAL_OF_DAY,
      PRODUCT_LIST_TYPES.NEW_ARRIVALS,
    ] as ProductListType[]
  ).includes(productListType);

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

  const isLoading = isCategorized ? isCategorizedLoading : isInfiniteLoading;
  const error = isCategorized ? categorizedError : infiniteError;

  const products = useMemo(() => {
    return isCategorized
      ? getProductsByListType(productListType, categorizedData)
      : infiniteData?.pages.flatMap(
          (page: { data: IProduct[] }) => page.data,
        ) ?? [];
  }, [isCategorized, productListType, categorizedData, infiniteData]);

  const onEndReached = isCategorized ? undefined : fetchNextPage;
  const isLoadingMore = isCategorized ? false : isFetchingNextPage;
  const hasMore = isCategorized ? false : hasNextPage;
  const refreshing = isLoading && products.length > 0;

  const handleItemPress = (id: string) => {
    navigation.navigate(PRIVATE_SCREENS.PRODUCT_DETAIL, { productId: id });
  };

  const handleRefresh = () => {
    if (isCategorized) {
      refetchCategorized();
    } else {
      refetchInfinite();
    }
  };

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
