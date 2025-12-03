import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

// Services
import { productsService } from '@app/services/product';

// Constants
import { QUERY_KEYS } from '@app/constants/queryKeys';

// Types
import type { IProductCardProps } from '@app/interfaces/ui';
import type { IProduct } from '@app/interfaces/product';
import type { ApiProduct } from '@app/interfaces/api';

// Helpers
import {
  filterProductsByCategorySlug,
  filterProductsBySearchQuery,
} from '@app/helpers/products';

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

// This hook uses the cache-first strategy but still allows for refetching
const useAllProducts = () => {
  return useQuery<IProductCardProps[]>({
    queryKey: [QUERY_KEYS.PRODUCTS, 'all'],
    queryFn: () => productsService.getAllProducts(),
    ...DEFAULT_QUERY_OPTIONS,
    // Cache all products for 5 minutes to prevent redundant requests
    // This fixes the "crash on multiple requests" bug by avoiding new fetches
    // on every keystroke.
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // Garbage collect after 10 minutes
  });
};

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

  // Use the shared "all products" query
  const query = useAllProducts();

  // Filter locally
  const filteredProducts = useMemo(() => {
    if (!query.data) return [];

    if (!normalizedSlug) {
      return query.data;
    }

    // Cast to ApiProduct[] for helper compatibility, assuming runtime structure is compatible
    return filterProductsByCategorySlug(
      query.data as unknown as ApiProduct[],
      normalizedSlug,
    ) as unknown as IProductCardProps[];
  }, [query.data, normalizedSlug]);

  return {
    ...query,
    products: enabled ? filteredProducts : [],
  };
};

export const useSearchProducts = (
  searchQuery?: string | null,
  categorySlug?: string | null,
) => {
  const normalizedQuery = searchQuery?.trim() ?? '';
  const normalizedCategory = categorySlug?.trim() ?? undefined;
  const hasQuery = Boolean(normalizedQuery);

  // Use the shared "all products" query
  const query = useAllProducts();

  // Filter locally
  const filteredProducts = useMemo(() => {
    if (!query.data || !hasQuery) return [];

    let result = query.data as unknown as ApiProduct[];

    // Filter by query
    result = filterProductsBySearchQuery(result, normalizedQuery);

    // Filter by category if present
    if (normalizedCategory) {
      result = filterProductsByCategorySlug(result, normalizedCategory);
    }

    return result as unknown as IProductCardProps[];
  }, [query.data, normalizedQuery, normalizedCategory, hasQuery]);

  return {
    ...query,
    products: filteredProducts,
  };
};
