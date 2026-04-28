import { PRODUCT_LIST_TYPES } from '@app/constants';
import { API_CONFIG } from '@app/constants/api';

// Interfaces
import type { CategorizedProducts } from '@app/interfaces/product';

//  Types
import type { ProductListType } from '@app/constants';
import type {
  ApiProduct,
  ApiDeal,
  ApiProductWithCategories,
} from '@app/interfaces/api';
import type { IProductCardProps } from '@app/interfaces/ui';

const normalizeSlug = (value?: string | null): string => {
  if (typeof value !== 'string') return '';
  return value.toLowerCase().trim();
};

export const buildProductImageSource = (
  images?: { url?: string | null }[] | null,
): { uri: string } => {
  const imageUrl = images?.[0]?.url;

  if (!imageUrl) return { uri: '' };

  const fullUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${API_CONFIG.STRAPI_BASE_URL}${imageUrl}`;

  return { uri: fullUrl };
};

export const mapApiProductToCard = (product: ApiProduct): IProductCardProps => {
  const { documentId, id, ...restProduct } = product;

  return {
    ...restProduct,
    id: String(documentId ?? id),
    name: product.title,
    description: product.description,
    currency: 'USD',
    rating: product.ratingAvg ?? 0,
    reviewCount: product.ratingCount ?? 0,
    imageSource: buildProductImageSource(product.images),
  };
};

export const filterProductsByDealSlug = (
  products: ApiProduct[],
  slug: string,
): ApiProduct[] => {
  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug) return [];

  return products.filter(product => {
    const deals = product.deals;

    if (!Array.isArray(deals) || deals.length === 0) return false;

    return deals.some((deal: ApiDeal) => {
      const dealSlug = normalizeSlug(deal.slug);
      const dealTitle = normalizeSlug(deal.title);

      return dealSlug === normalizedSlug || dealTitle === normalizedSlug;
    });
  });
};

export const filterTrendingProducts = (
  products: ApiProduct[],
): ApiProduct[] => {
  return products.filter(product => {
    const trendings = product.trendings;

    return Array.isArray(trendings) && trendings.length > 0;
  });
};

export const getProductsByListType = (
  type: ProductListType,
  data?: CategorizedProducts,
): IProductCardProps[] => {
  if (!data) return [];

  switch (type) {
    case PRODUCT_LIST_TYPES.TRENDING:
      return data.trending;

    case PRODUCT_LIST_TYPES.NEW_ARRIVALS:
      return data.newArrivals;

    case PRODUCT_LIST_TYPES.DEAL_OF_DAY:
    case PRODUCT_LIST_TYPES.DEALS:
      return data.deals;

    default:
      return [];
  }
};

export const filterProductsByCategorySlug = (
  products: ApiProduct[],
  categorySlug: string,
): ApiProduct[] => {
  const normalizedTarget = normalizeSlug(categorySlug);

  if (!normalizedTarget) return [];

  if (!Array.isArray(products) || products.length === 0) return [];

  return products.filter(product => {
    const productWithCategories = product as ApiProductWithCategories;

    const slugs = [
      normalizeSlug(productWithCategories.categorySlug),
      normalizeSlug(productWithCategories.category?.slug),
      normalizeSlug(productWithCategories.category?.attributes?.slug),
      ...(productWithCategories.categories ?? []).flatMap(cat => [
        normalizeSlug(cat.slug),
        normalizeSlug(cat.attributes?.slug),
      ]),
    ].filter(Boolean);

    return slugs.includes(normalizedTarget);
  });
};

export const filterProductsBySearchQuery = (
  products: ApiProduct[],
  searchQuery: string,
): ApiProduct[] => {
  if (!Array.isArray(products) || products.length === 0) return [];

  const normalizedSearch = searchQuery.toLowerCase().trim();

  if (!normalizedSearch) return products;

  return products.filter(product => {
    const title = product.title?.toLowerCase() || '';

    return title.includes(normalizedSearch);
  });
};
