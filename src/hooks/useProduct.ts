import { useMemo } from 'react';

// React Query
import { useQueries, useQuery, useInfiniteQuery } from '@tanstack/react-query';

// Services
import { productsService } from '@app/services/product';

// Constants
import { QUERY_KEYS } from '@app/constants/queryKeys';

// Types
import type { IProduct, CategorizedProducts } from '@app/interfaces/product';
import type { ApiProduct } from '@app/interfaces/api';

// Helpers
import {
  filterProductsByCategorySlug,
  filterProductsBySearchQuery,
  mapApiProductToCard,
} from '@app/helpers/products';

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

/**
 * Shared hook to fetch all products with caching
 */
const useAllProducts = () => {
  return useQuery<ApiProduct[]>({
    queryKey: [QUERY_KEYS.PRODUCTS, 'all'],
    queryFn: productsService.fetchAllProducts,
    ...DEFAULT_QUERY_OPTIONS,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Shared hook to fetch products with pagination (Infinite Scroll)
 */
export const useInfiniteProducts = (
  pageSize: number = 10,
  options: { enabled?: boolean } = {},
) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'infinite', pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await productsService.fetchAllProducts();
      const start = (pageParam - 1) * pageSize;
      const end = start + pageSize;

      return {
        data: response.slice(start, end).map(mapApiProductToCard),
        nextPage: response.length > end ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage,
    enabled: options.enabled,
    ...DEFAULT_QUERY_OPTIONS,
  });
};

/**
 * Hook to get products grouped by category (deals, trending, etc.)
 */
export const useCategorizedProducts = (options: { enabled?: boolean } = {}) => {
  const query = useQuery<CategorizedProducts>({
    queryKey: [QUERY_KEYS.PRODUCTS, QUERY_KEYS.PRODUCTS_CATEGORIZED],
    queryFn: productsService.getCategorizedProducts,
    enabled: options.enabled,
    ...DEFAULT_QUERY_OPTIONS,
    staleTime: 60_000,
  });

  return {
    ...query,
    products: query.data ?? EMPTY_CATEGORIZED_PRODUCTS,
  };
};

/**
 * Hook to fetch a single product by its ID
 */
export const useProductById = (productId?: string) => {
  const query = useQuery<IProduct>({
    queryKey: [QUERY_KEYS.PRODUCT, productId],
    queryFn: () =>
      productId
        ? productsService.getProductById(productId)
        : Promise.reject('No ID'),
    enabled: Boolean(productId),
    ...DEFAULT_QUERY_OPTIONS,
  });

  return {
    ...query,
    product: query.data,
  };
};

/**
 * Hook to fetch multiple products by their IDs efficiently
 */
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

  const products = useMemo(
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

/**
 * Hook to filter products by category locally from cached all products
 */
export const useProductsByCategory = (
  categorySlug?: string,
  enabled: boolean = true,
) => {
  const normalizedSlug = categorySlug?.trim() ?? '';
  const query = useAllProducts();

  const filteredProducts = useMemo(() => {
    if (!query.data) return [];
    if (!normalizedSlug) return query.data.map(mapApiProductToCard);

    return filterProductsByCategorySlug(query.data, normalizedSlug).map(
      mapApiProductToCard,
    );
  }, [query.data, normalizedSlug]);

  return {
    ...query,
    products: enabled ? filteredProducts : [],
  };
};

/**
 * Hook to search products locally from cached all products
 */
export const useSearchProducts = (
  searchQuery?: string | null,
  categorySlug?: string | null,
) => {
  const normalizedQuery = searchQuery?.trim() ?? '';
  const normalizedCategory = categorySlug?.trim() ?? undefined;
  const hasQuery = Boolean(normalizedQuery);

  const query = useAllProducts();

  const filteredProducts = useMemo(() => {
    if (!query.data || !hasQuery) return [];

    let result = filterProductsBySearchQuery(query.data, normalizedQuery);

    if (normalizedCategory) {
      result = filterProductsByCategorySlug(result, normalizedCategory);
    }

    return result.map(mapApiProductToCard);
  }, [query.data, normalizedQuery, normalizedCategory, hasQuery]);

  return {
    ...query,
    products: filteredProducts,
  };
};
