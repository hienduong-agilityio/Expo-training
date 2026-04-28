// Enums
import { NotificationChannel, NotificationType } from '@app/enums/notification';

/**
 * Channel mapping from NotificationType to NotificationChannel
 */
export const CHANNEL_MAPPING: Record<NotificationType, NotificationChannel> = {
  [NotificationType.FLASH_SALE]: NotificationChannel.PROMOTION,
  [NotificationType.PROMOTION]: NotificationChannel.PROMOTION,
  [NotificationType.COUPON_AVAILABLE]: NotificationChannel.PROMOTION,
  [NotificationType.DEAL_OF_THE_DAY]: NotificationChannel.PROMOTION,
  [NotificationType.LIMITED_TIME_OFFER]: NotificationChannel.PROMOTION,

  [NotificationType.PRICE_DROP]: NotificationChannel.PRODUCT,
  [NotificationType.BACK_IN_STOCK]: NotificationChannel.PRODUCT,
  [NotificationType.NEW_ARRIVAL]: NotificationChannel.PRODUCT,
  [NotificationType.WISHLIST_ITEM_ON_SALE]: NotificationChannel.PRODUCT,
  [NotificationType.PRODUCT_RECOMMENDATION]: NotificationChannel.PRODUCT,

  [NotificationType.CART_ABANDONMENT]: NotificationChannel.CART,
  [NotificationType.CART_ITEM_LOW_STOCK]: NotificationChannel.CART,

  [NotificationType.GENERAL]: NotificationChannel.GENERAL,
};

/**
 * Channel names and descriptions
 */
const CHANNEL_INFO: Record<
  NotificationChannel,
  { name: string; description: string }
> = {
  [NotificationChannel.PROMOTION]: {
    name: 'Promotions',
    description: 'Notifications about promotions and hot deals',
  },
  [NotificationChannel.PRODUCT]: {
    name: 'Products',
    description: 'Notifications about products you care about',
  },
  [NotificationChannel.CART]: {
    name: 'Cart',
    description: 'Notifications about your cart',
  },
  [NotificationChannel.GENERAL]: {
    name: 'General Notifications',
    description: 'Other general notifications',
  },
};

/**
 * Notification channel configurations
 */
export const NOTIFICATION_CHANNELS = Object.values(NotificationChannel).map(
  channelId => ({
    id: channelId,
    ...CHANNEL_INFO[channelId],
  }),
);
