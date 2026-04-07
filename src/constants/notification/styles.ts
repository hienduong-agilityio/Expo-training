// Enums
import { NotificationType } from '@app/enums/notification';

// Themes
import { colors } from '@app/themes/colors';

// Types
import type { NotificationStyle } from '@app/interfaces/notification';

/**
 * Notification styles for each notification type
 */
export const NOTIFICATION_STYLES: Record<NotificationType, NotificationStyle> =
  {
    // Promotional Notifications
    [NotificationType.FLASH_SALE]: {
      backgroundColor: colors.primary,
      textColor: colors.white,
      accentColor: colors.limitedTime,
    },
    [NotificationType.PROMOTION]: {
      backgroundColor: colors.secondary,
      textColor: colors.white,
      accentColor: colors.white,
    },
    [NotificationType.COUPON_AVAILABLE]: {
      backgroundColor: colors.warning,
      textColor: colors.text,
      accentColor: colors.primary,
    },
    [NotificationType.DEAL_OF_THE_DAY]: {
      backgroundColor: colors.summerSale,
      textColor: colors.white,
      accentColor: colors.white,
    },
    [NotificationType.LIMITED_TIME_OFFER]: {
      backgroundColor: colors.primary,
      textColor: colors.white,
      accentColor: colors.limitedTime,
    },

    // Product Notifications
    [NotificationType.PRICE_DROP]: {
      backgroundColor: colors.sale,
      textColor: colors.white,
      accentColor: colors.white,
    },
    [NotificationType.BACK_IN_STOCK]: {
      backgroundColor: colors.success,
      textColor: colors.white,
      accentColor: colors.white,
    },
    [NotificationType.NEW_ARRIVAL]: {
      backgroundColor: colors.info,
      textColor: colors.white,
      accentColor: colors.white,
    },
    [NotificationType.WISHLIST_ITEM_ON_SALE]: {
      backgroundColor: colors.primary,
      textColor: colors.white,
      accentColor: colors.white,
    },
    [NotificationType.PRODUCT_RECOMMENDATION]: {
      backgroundColor: colors.secondaryLight,
      textColor: colors.text,
      accentColor: colors.secondary,
    },

    // Cart Notifications
    [NotificationType.CART_ABANDONMENT]: {
      backgroundColor: colors.warning,
      textColor: colors.text,
      accentColor: colors.primary,
    },
    [NotificationType.CART_ITEM_LOW_STOCK]: {
      backgroundColor: colors.error,
      textColor: colors.white,
      accentColor: colors.white,
    },

    // General
    [NotificationType.GENERAL]: {
      backgroundColor: colors.surface,
      textColor: colors.text,
      accentColor: colors.primary,
    },
  };
