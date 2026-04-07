export const PRODUCT_ENDPOINTS = {
  PRODUCTS: '/products',
  DEALS: '/deals',
  TRENDINGS: '/trendings',
} as const;

export const PRODUCT_DEAL_SLUGS = {
  DEAL_OF_DAY: 'deal-of-the-day',
  NEW_ARRIVALS: 'new-arrivals',
  TRENDING: 'trending',
} as const;

export const PRODUCT_LIST_TYPES = {
  TRENDING: 'trending',
  DEALS: 'deals',
  WISHLIST: 'wishlist',
  SUMMER: 'summer',
  NEW_ARRIVALS: 'new-arrivals',
  DEAL_OF_DAY: 'deal-of-day',
  WEEKEND_SPECIAL: 'weekend-special',
} as const;

export type ProductListType =
  (typeof PRODUCT_LIST_TYPES)[keyof typeof PRODUCT_LIST_TYPES];

export const PRODUCT_LIST_TITLES: Record<ProductListType, string> = {
  [PRODUCT_LIST_TYPES.TRENDING]: 'Trending Products',
  [PRODUCT_LIST_TYPES.DEALS]: 'Deals',
  [PRODUCT_LIST_TYPES.WISHLIST]: 'Wishlist',
  [PRODUCT_LIST_TYPES.SUMMER]: 'Summer Sale',
  [PRODUCT_LIST_TYPES.NEW_ARRIVALS]: 'New Arrivals',
  [PRODUCT_LIST_TYPES.DEAL_OF_DAY]: 'Deal of the Day',
  [PRODUCT_LIST_TYPES.WEEKEND_SPECIAL]: 'Weekend Special',
} as const;

export const PRODUCT_MESSAGES = {
  LOADING_DETAILS: 'Loading product details...',
  NOT_FOUND: 'Product Not Found',
  NOT_FOUND_DESCRIPTION:
    "The product you're looking for doesn't exist or has been removed.",
  FAILED_TO_LOAD: 'Failed to Load Product',
  FAILED_TO_LOAD_DESCRIPTION:
    'Unable to load product details. Please try again.',
  GO_BACK: 'Go Back',
  RETRY: 'Retry',
  PRODUCT_DETAILS: 'Product Details',
  NO_DETAILS_AVAILABLE: 'No details available',
  VIEW_SIMILAR: 'View Similar',
  VIEW_SIMILAR_DESCRIPTION: 'Showing similar products',
  ADD_TO_COMPARE: 'Add to Compare',
  ADD_TO_COMPARE_DESCRIPTION: 'Product added to comparison',
  PROCEED_TO_CHECKOUT: (productName: string) =>
    `Proceeding to checkout with ${productName}`,
} as const;

export const FILTER_MESSAGES = {
  ALL_CATEGORIES: 'All Categories',
} as const;

export const SEARCH_MESSAGES = {
  PLACEHOLDER: 'Search for products',
} as const;

export const SEARCH_SCREEN_MESSAGES = {
  DEFAULT_TITLE: 'All Featured',
  SEARCH_PREFIX: 'Search: ',
  PRODUCT_SINGULAR: 'product',
  PRODUCT_PLURAL: 'products',
  LOADING: 'Loading products...',
  ERROR_TITLE: 'Something went wrong',
  ERROR_DESCRIPTION: 'Please try again later',
  NOT_FOUND_TITLE: 'No products found',
  NOT_FOUND_DESC_PREFIX: 'No products match',
  NOT_FOUND_DESC_DEFAULT: 'Try adjusting your filters',
} as const;
