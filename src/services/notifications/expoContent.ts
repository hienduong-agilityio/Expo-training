// Enums
import { NotificationType } from '@app/enums/notification';

// Constants
import { NOTIFICATION_DEFAULTS } from '@app/constants/notification';

// Types
import type { NotificationData } from '@app/interfaces/notification';

// Helpers
import { safeString, safeNumber } from '@app/helpers/converters';

/**
 * Build NotificationData from an Expo notification content payload.
 */
export const notificationDataFromExpoContent = (content: {
  title: string | null;
  body: string | null;
  data?: Record<string, unknown>;
}): NotificationData => {
  const data = content.data ?? {};

  return {
    type: (data.type as NotificationType) || NotificationType.GENERAL,
    title:
      content.title || safeString(data.title) || NOTIFICATION_DEFAULTS.TITLE,
    body: content.body || safeString(data.body) || NOTIFICATION_DEFAULTS.BODY,
    imageUrl: safeString(data.imageUrl),
    deepLink: safeString(data.deepLink),
    productId: safeString(data.productId),
    documentId: safeString(data.documentId),
    productListType: safeString(
      data.productListType,
    ) as NotificationData['productListType'],
    couponCode: safeString(data.couponCode),
    discount: safeNumber(data.discount),
    priority: safeString(data.priority) as NotificationData['priority'],
    timestamp: Date.now(),
  };
};
