export enum NotificationType {
  // Promotional Notifications
  FLASH_SALE = 'FLASH_SALE',
  PROMOTION = 'PROMOTION',
  COUPON_AVAILABLE = 'COUPON_AVAILABLE',
  DEAL_OF_THE_DAY = 'DEAL_OF_THE_DAY',
  LIMITED_TIME_OFFER = 'LIMITED_TIME_OFFER',

  // Product Notifications
  PRICE_DROP = 'PRICE_DROP',
  BACK_IN_STOCK = 'BACK_IN_STOCK',
  NEW_ARRIVAL = 'NEW_ARRIVAL',
  WISHLIST_ITEM_ON_SALE = 'WISHLIST_ITEM_ON_SALE',
  PRODUCT_RECOMMENDATION = 'PRODUCT_RECOMMENDATION',

  // Cart Notifications
  CART_ABANDONMENT = 'CART_ABANDONMENT',
  CART_ITEM_LOW_STOCK = 'CART_ITEM_LOW_STOCK',

  GENERAL = 'GENERAL',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  MAX = 'max',
}

export enum NotificationChannel {
  PROMOTION = 'promotion',
  PRODUCT = 'product',
  CART = 'cart',
  GENERAL = 'general',
}
