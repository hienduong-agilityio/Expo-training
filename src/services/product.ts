// Services
import { apiRequest } from '@app/services/apiClient';

// Constants
import { PRODUCT_DEAL_SLUGS, PRODUCT_ENDPOINTS } from '@app/constants/product';
import { HTTP_METHODS } from '@app/constants/api';

// Types
import type { IProductCardProps } from '@app/interfaces/ui';
import type { ApiProduct, StrapiResponse } from '@app/interfaces/api';
import type { IProduct } from '@app/interfaces/product';

// Helpers
import {
  mapApiProductToCard,
  filterProductsByDealSlug,
  filterTrendingProducts,
  filterProductsByCategorySlug,
  filterProductsBySearchQuery,
} from '@app/helpers/products';

/**
 * Generic response parser for Strapi-style data structures
 */
const parseData = <T>(response: T | { data: T }): T => {
  if (!response) return null as T;

  if (typeof response === 'object' && 'data' in response) {
    const data = (response as { data: T }).data;
    return data ?? (null as T);
  }

  return response as T;
};

/**
 * Fetches all products from the API
 */
const fetchAllProducts = async (): Promise<ApiProduct[]> => {
  const response = await apiRequest<
    ApiProduct[] | StrapiResponse<ApiProduct[]>
  >(PRODUCT_ENDPOINTS.PRODUCTS, {
    method: HTTP_METHODS.GET,
    query: { populate: '*', pagination: { pageSize: 1000 } },
  });

  const parsed = parseData<ApiProduct[]>(response);

  return Array.isArray(parsed) ? parsed : [];
};

/**
 * Fetches a single product by ID
 */
const fetchProductById = async (id: string): Promise<ApiProduct> => {
  const response = await apiRequest<ApiProduct | StrapiResponse<ApiProduct>>(
    `${PRODUCT_ENDPOINTS.PRODUCTS}/${id}`,
    {
      method: HTTP_METHODS.GET,
      query: { populate: '*' },
    },
  );

  const product = parseData<ApiProduct>(response);

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

/**
 * Fetches products grouped by categories (deals, trending, new arrivals)
 */
const getCategorizedProducts = async () => {
  const allProducts = await fetchAllProducts();

  return {
    deals: filterProductsByDealSlug(
      allProducts,
      PRODUCT_DEAL_SLUGS.DEAL_OF_DAY,
    ).map(mapApiProductToCard),
    trending: filterTrendingProducts(allProducts).map(mapApiProductToCard),
    newArrivals: filterProductsByDealSlug(
      allProducts,
      PRODUCT_DEAL_SLUGS.NEW_ARRIVALS,
    ).map(mapApiProductToCard),
  };
};

/**
 * Fetches a single product by ID and transforms it to IProduct format
 */
const getProductById = async (id: string): Promise<IProduct> => {
  const product = await fetchProductById(id);
  return mapApiProductToCard(product);
};

/**
 * Fetches products filtered by category slug
 */
const getProductsByCategory = async (
  categorySlug?: string,
): Promise<IProductCardProps[]> => {
  const allProducts = await fetchAllProducts();
  if (!Array.isArray(allProducts) || allProducts.length === 0) return [];

  const normalizedSlug = categorySlug?.trim();
  if (!normalizedSlug) return allProducts.map(mapApiProductToCard);

  return filterProductsByCategorySlug(allProducts, normalizedSlug).map(
    mapApiProductToCard,
  );
};

/**
 * Searches products by query and optional category
 */
const searchProducts = async (
  searchQuery: string,
  categorySlug?: string,
): Promise<IProductCardProps[]> => {
  const normalizedQuery = searchQuery?.trim();
  if (!normalizedQuery) return [];

  const allProducts = await fetchAllProducts();
  if (allProducts.length === 0) return [];

  let filtered = filterProductsBySearchQuery(allProducts, normalizedQuery);

  if (categorySlug?.trim()) {
    filtered = filterProductsByCategorySlug(filtered, categorySlug.trim());
  }

  return filtered.map(mapApiProductToCard);
};

/**
 * Fetches all products transformed to card props
 */
const getAllProducts = async (): Promise<IProductCardProps[]> => {
  return (await fetchAllProducts()).map(mapApiProductToCard);
};

export const productsService = {
  getCategorizedProducts,
  getProductById,
  fetchAllProducts,
  getProductsByCategory,
  searchProducts,
  getAllProducts,
} as const;
