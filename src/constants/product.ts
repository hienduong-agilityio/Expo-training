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

export interface DealInfo {
  title: string;
  badge?: {
    icon: string;
    text: string;
    color: string;
  };
  countdown?: {
    text: string;
    color: string;
  };
}

export const DEAL_INFO = {
  dealOfDay: {
    title: 'Deal of the Day',
    countdown: {
      text: '22h 55m 20s remaining',
      color: '#4392F9',
    },
  },
  weekendSpecial: {
    title: 'Weekend Special',
    badge: {
      icon: '🎉',
      text: 'Limited Time',
      color: '#FFD700',
    },
  },
  trending: {
    title: 'Trending Products',
    countdown: {
      text: 'Last Date 29/02/22',
      color: '#F83758',
    },
  },
  newArrivals: {
    title: 'New Arrivals',
    subtitle: "Summer '25 Collections",
  },
} as const;
