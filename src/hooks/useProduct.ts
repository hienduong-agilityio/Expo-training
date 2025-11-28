import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

// Services
import { productsService } from '@app/services/product';

// Constants
import { QUERY_KEYS } from '@app/constants/queryKeys';

// Types
import type { IProductCardProps } from '@app/interfaces/ui';
import type { IProduct } from '@app/interfaces/product';

export type CategorizedProducts = {
  deals: IProductCardProps[];
  trending: IProductCardProps[];
  newArrivals: IProductCardProps[];
};

const EMPTY_CATEGORIZED_PRODUCTS: CategorizedProducts = {
  deals: [],
  trending: [],
  newArrivals: [],
};

const DEFAULT_QUERY_OPTIONS = {
  staleTime: 30_000,
  retry: 3,
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30_000),
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
} as const;

// Apply this structure to all useQuery hooks
export const useCategorizedProducts = () => {
  const query = useQuery<CategorizedProducts>({
    queryKey: [QUERY_KEYS.PRODUCTS, QUERY_KEYS.PRODUCTS_CATEGORIZED],
    queryFn: () => productsService.getCategorizedProducts(),
    staleTime: 60_000,
    retry: DEFAULT_QUERY_OPTIONS.retry,
    retryDelay: DEFAULT_QUERY_OPTIONS.retryDelay,
    refetchOnWindowFocus: DEFAULT_QUERY_OPTIONS.refetchOnWindowFocus,
    refetchOnReconnect: DEFAULT_QUERY_OPTIONS.refetchOnReconnect,
  });

  return {
    ...query,
    products: query.data ?? EMPTY_CATEGORIZED_PRODUCTS,
  };
};

export const useProductById = (productId: string) => {
  const query = useQuery<IProduct>({
    queryKey: [QUERY_KEYS.PRODUCT, productId],
    queryFn: () => productsService.getProductById(productId),
    enabled: Boolean(productId),
    ...DEFAULT_QUERY_OPTIONS,
  });

  return {
    ...query,
    product: query.data,
  };
};

export const useProductsByIds = (ids: string[]) => {
  const validIds = useMemo(
    () => ids.filter((id): id is string => Boolean(id)),
    [ids],
  );

  const queries = useQueries({
    queries: validIds.map(id => ({
      queryKey: [QUERY_KEYS.PRODUCT, id],
      queryFn: () => productsService.getProductById(id),
      ...DEFAULT_QUERY_OPTIONS,
    })),
  });

  const isLoading = queries.some(query => query.isLoading);
  const isError = queries.some(query => query.isError);

  const products: IProduct[] = useMemo(
    () =>
      queries
        .map(query => query.data)
        .filter((product): product is IProduct => Boolean(product)),
    [queries],
  );

  const productMap = useMemo(() => {
    const map = new Map<string, IProduct>();
    products.forEach(product => map.set(product.id, product));

    return map;
  }, [products]);

  return {
    products,
    productMap,
    isLoading,
    isError,
  };
};

export const useProductsByCategory = (
  categorySlug?: string,
  enabled: boolean = true,
) => {
  const normalizedSlug = categorySlug?.trim() ?? '';
  const queryKey = normalizedSlug || 'all';

  const query = useQuery<IProductCardProps[]>({
    queryKey: [QUERY_KEYS.PRODUCTS, QUERY_KEYS.PRODUCTS_CATEGORY, queryKey],
    queryFn: () =>
      productsService.getProductsByCategory(normalizedSlug || undefined),
    enabled,
    ...DEFAULT_QUERY_OPTIONS,
  });

  return {
    ...query,
    products: query.data ?? [],
  };
};

export const useSearchProducts = (
  searchQuery?: string | null,
  categorySlug?: string | null,
) => {
  const normalizedQuery = searchQuery?.trim() ?? '';
  const normalizedCategory = categorySlug?.trim() ?? undefined;
  const hasQuery = Boolean(normalizedQuery);

  const queryKey = normalizedQuery
    ? [
        QUERY_KEYS.PRODUCTS,
        QUERY_KEYS.PRODUCTS_SEARCH,
        normalizedQuery,
        normalizedCategory ?? 'all',
      ]
    : [
        QUERY_KEYS.PRODUCTS,
        QUERY_KEYS.PRODUCTS_SEARCH,
        QUERY_KEYS.PRODUCTS_SEARCH_EMPTY,
      ];

  const query = useQuery<IProductCardProps[]>({
    queryKey,
    queryFn: () =>
      productsService.searchProducts(normalizedQuery, normalizedCategory),
    enabled: hasQuery,
    ...DEFAULT_QUERY_OPTIONS,
  });

  return {
    ...query,
    products: query.data ?? [],
  };
};
