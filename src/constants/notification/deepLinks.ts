// Enums
import { NotificationType } from '@app/enums/notification';

// Constants
import { DEEP_LINK_PATHS } from './constants';

/**
 * Deep link mapping by notification type
 */
export const DEEP_LINK_BY_TYPE: Record<NotificationType, string> = {
  [NotificationType.NEW_ARRIVAL]: DEEP_LINK_PATHS.NEW_ARRIVALS,
  [NotificationType.DEAL_OF_THE_DAY]: DEEP_LINK_PATHS.DEAL_OF_DAY,
  [NotificationType.PROMOTION]: DEEP_LINK_PATHS.TRENDING,
  [NotificationType.CART_ABANDONMENT]: DEEP_LINK_PATHS.CART,
  [NotificationType.CART_ITEM_LOW_STOCK]: DEEP_LINK_PATHS.CART,
  [NotificationType.WISHLIST_ITEM_ON_SALE]: DEEP_LINK_PATHS.WISHLIST,
  [NotificationType.FLASH_SALE]: DEEP_LINK_PATHS.TRENDING,
  [NotificationType.COUPON_AVAILABLE]: DEEP_LINK_PATHS.CART,
  [NotificationType.LIMITED_TIME_OFFER]: DEEP_LINK_PATHS.TRENDING,
  [NotificationType.PRICE_DROP]: DEEP_LINK_PATHS.HOME,
  [NotificationType.BACK_IN_STOCK]: DEEP_LINK_PATHS.HOME,
  [NotificationType.PRODUCT_RECOMMENDATION]: DEEP_LINK_PATHS.HOME,
  [NotificationType.GENERAL]: DEEP_LINK_PATHS.HOME,
};
