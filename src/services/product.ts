import { apiRequest } from '@app/services/apiClient';

// Types
import type { IProductCardProps } from '@app/interfaces/ui';
import type { ApiProduct } from '@app/interfaces/api';
import type { IProduct } from '@app/interfaces/product';

// Helpers
import {
  mapApiProductToCard,
  filterProductsByDealSlug,
  filterTrendingProducts,
  filterProductsByCategorySlug,
  filterProductsBySearchQuery,
} from '@app/helpers/products';

// Constants
import { PRODUCT_DEAL_SLUGS, PRODUCT_ENDPOINTS } from '@app/constants/product';
import { HTTP_METHODS } from '@app/constants/api';

const parseApiListResponse = <T>(
  response: T[] | { data: T[] } | null | undefined,
): T[] => {
  if (!response) return [];

  if (Array.isArray(response)) {
    return response;
  }

  if (typeof response === 'object' && 'data' in response) {
    return Array.isArray(response.data) ? response.data : [];
  }

  return [];
};

const parseApiSingleResponse = <T>(
  response: T | { data: T } | null | undefined,
): T | null => {
  if (!response) return null;

  if (typeof response === 'object' && 'data' in response) {
    return response.data ?? null;
  }

  return response as T;
};

const fetchAllProducts = async (): Promise<ApiProduct[]> => {
  const response = await apiRequest<ApiProduct[] | { data: ApiProduct[] }>(
    PRODUCT_ENDPOINTS.PRODUCTS,
    {
      method: HTTP_METHODS.GET,
      query: { populate: '*' },
    },
  );

  return parseApiListResponse(response);
};

const fetchProductById = async (id: string): Promise<ApiProduct> => {
  const response = await apiRequest<ApiProduct | { data: ApiProduct }>(
    `${PRODUCT_ENDPOINTS.PRODUCTS}/${id}`,
    {
      method: HTTP_METHODS.GET,
      query: { populate: '*' },
    },
  );

  const product = parseApiSingleResponse(response);

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

const transformToCardProps = (products: ApiProduct[]): IProductCardProps[] => {
  return products.map(mapApiProductToCard);
};

export const getCategorizedProducts = async (): Promise<{
  deals: IProductCardProps[];
  trending: IProductCardProps[];
  newArrivals: IProductCardProps[];
}> => {
  const allProducts = await fetchAllProducts();

  return {
    deals: transformToCardProps(
      filterProductsByDealSlug(allProducts, PRODUCT_DEAL_SLUGS.DEAL_OF_DAY),
    ),
    trending: transformToCardProps(filterTrendingProducts(allProducts)),
    newArrivals: transformToCardProps(
      filterProductsByDealSlug(allProducts, PRODUCT_DEAL_SLUGS.NEW_ARRIVALS),
    ),
  };
};

export const getProductById = async (id: string): Promise<IProduct> => {
  const product = await fetchProductById(id);

  return mapApiProductToCard(product);
};

export const getProductsByCategory = async (
  categorySlug?: string,
): Promise<IProductCardProps[]> => {
  const allProducts = await fetchAllProducts();

  if (allProducts.length === 0) {
    return [];
  }

  const normalizedSlug = categorySlug?.trim();

  if (!normalizedSlug) {
    return transformToCardProps(allProducts);
  }

  const filtered = filterProductsByCategorySlug(allProducts, normalizedSlug);

  return transformToCardProps(filtered);
};

export const searchProducts = async (
  searchQuery: string,
  categorySlug?: string,
): Promise<IProductCardProps[]> => {
  const normalizedQuery = searchQuery?.trim();

  if (!normalizedQuery) {
    return [];
  }

  const allProducts = await fetchAllProducts();

  if (allProducts.length === 0) {
    return [];
  }

  let filteredProducts = filterProductsBySearchQuery(
    allProducts,
    normalizedQuery,
  );

  if (categorySlug?.trim()) {
    filteredProducts = filterProductsByCategorySlug(
      filteredProducts,
      categorySlug.trim(),
    );
  }

  return transformToCardProps(filteredProducts);
};

export const productsService = {
  getCategorizedProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
};
