import { useLayoutEffect, useMemo } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';

// Types
import type { ProductListType } from '@app/constants';
import type { IProduct } from '@app/interfaces/product';

// Constants
import { PRODUCT_LIST_TYPES, PRODUCT_LIST_TITLES } from '@app/constants';

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

const paramStr = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const isProductListType = (s: string): s is ProductListType =>
  (Object.values(PRODUCT_LIST_TYPES) as string[]).includes(s);

export const ProductListScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { type: rawType } = useLocalSearchParams<{ type: string | string[] }>();
  const typeParam = paramStr(rawType) ?? '';
  const validType = isProductListType(typeParam);
  const productListType = validType ? typeParam : PRODUCT_LIST_TYPES.TRENDING;
  const title = validType ? PRODUCT_LIST_TITLES[productListType] : 'Products';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: title || 'Products',
    });
  }, [navigation, title]);

  const isCategorized = validType
    ? (
        [
          PRODUCT_LIST_TYPES.TRENDING,
          PRODUCT_LIST_TYPES.DEALS,
          PRODUCT_LIST_TYPES.DEAL_OF_DAY,
          PRODUCT_LIST_TYPES.NEW_ARRIVALS,
        ] as ProductListType[]
      ).includes(productListType)
    : false;

  const {
    data: categorizedData,
    isLoading: isCategorizedLoading,
    error: categorizedError,
    refetch: refetchCategorized,
  } = useCategorizedProducts({ enabled: validType && isCategorized });

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInfiniteLoading,
    error: infiniteError,
    refetch: refetchInfinite,
  } = useInfiniteProducts(10, { enabled: validType && !isCategorized });

  const isLoading = isCategorized ? isCategorizedLoading : isInfiniteLoading;
  const error = isCategorized ? categorizedError : infiniteError;

  const products = useMemo(() => {
    if (!validType) {
      return [];
    }
    return isCategorized
      ? getProductsByListType(productListType, categorizedData)
      : infiniteData?.pages.flatMap(
          (page: { data: IProduct[] }) => page.data,
        ) ?? [];
  }, [isCategorized, productListType, categorizedData, infiniteData, validType]);

  const onEndReached = isCategorized ? undefined : fetchNextPage;
  const isLoadingMore = isCategorized ? false : isFetchingNextPage;
  const hasMore = isCategorized ? false : hasNextPage;
  const refreshing = isLoading && products.length > 0;

  const handleItemPress = (id: string) => {
    router.push(`/product/${id}`);
  };

  const handleRefresh = () => {
    if (isCategorized) {
      refetchCategorized();
    } else {
      refetchInfinite();
    }
  };

  if (!validType) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unknown product list.</Text>
      </View>
    );
  }

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
