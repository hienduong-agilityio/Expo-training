import type { ProductListType } from '@app/constants/product';

/**
 * Notification Action IDs
 */
export const NOTIFICATION_ACTION_IDS = {
  VIEW_PRODUCT: 'view_product',
  VIEW_PROMOTION: 'view_promotion',
  VIEW_PRODUCT_LIST: 'view_product_list',
  ADD_TO_CART: 'add_to_cart',
} as const;

/**
 * Notification Action Titles
 */
export const NOTIFICATION_ACTION_TITLES = {
  VIEW_NOW: 'View Now',
  COPY_CODE: 'Copy Code',
  APPLY: 'Apply',
  VIEW_NEW_PRODUCTS: 'View New Products',
  VIEW_PRODUCT: 'View Product',
  ADD_TO_CART: 'Add to Cart',
  COMPLETE_ORDER: 'Complete Order',
} as const;

/**
 * Deep Link Paths
 */
export const DEEP_LINK_PATHS = {
  HOME: 'stylish://home',
  CART: 'stylish://cart',
  WISHLIST: 'stylish://wishlist',
  NEW_ARRIVALS: 'stylish://products/new-arrivals',
  DEAL_OF_DAY: 'stylish://products/deal-of-day',
  TRENDING: 'stylish://products/trending',
  PRODUCT: (id: string) => `stylish://product/${id}`,
  PRODUCTS: (type: string) => `stylish://products/${type}`,
} as const;

/**
 * Product List Type Labels
 */
export const PRODUCT_LIST_TYPE_LABELS: Partial<
  Record<ProductListType, string>
> = {
  'new-arrivals': 'New Products',
  trending: 'Trending Now',
  'deal-of-day': "Today's Deal",
  deals: 'Promotions',
};

/**
 * Notification Display Constants
 */
export const NOTIFICATION_DISPLAY = {
  PRESS_ACTION_ID: 'default',
  LAUNCH_ACTIVITY: 'default',
  MAIN_COMPONENT: 'com.reactnativetemplate.MainActivity',
  SMALL_ICON: 'ic_notification',
  SOUND: 'default',
  VIBRATION_PATTERN: [300, 500],
  VISIBILITY: 1,
} as const;

export const NOTIFICATION_TIMING = {
  INITIAL_NOTIFICATION_DELAY: 1500,
} as const;

export const NOTIFICATION_DEFAULTS = {
  TITLE: 'New Notification',
  BODY: '',
} as const;
