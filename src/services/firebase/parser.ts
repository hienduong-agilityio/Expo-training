// Enums
import { NotificationType } from '@app/enums/notification';

// Constants
import { NOTIFICATION_DEFAULTS } from '@app/constants/notification';

// Types
import type {
  NotificationData,
  RemoteMessage,
} from '@app/interfaces/notification';

// Helpers
import { safeString, safeNumber } from '@app/helpers/converters';

/**
 * Parse notification data from Firebase message
 */
export const parseNotificationData = (
  remoteMessage: RemoteMessage,
): NotificationData => {
  const { data = {}, notification } = remoteMessage;

  const notificationData: NotificationData = {
    type: (data.type as NotificationType) || NotificationType.GENERAL,
    title:
      notification?.title ||
      safeString(data.title) ||
      NOTIFICATION_DEFAULTS.TITLE,
    body:
      notification?.body || safeString(data.body) || NOTIFICATION_DEFAULTS.BODY,
    imageUrl: notification?.android?.imageUrl || safeString(data.imageUrl),
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

  // Merge any additional data fields
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (!(key in acc)) {
      const strValue = safeString(value);
      if (strValue !== undefined) {
        acc[key] = strValue;
      }
    }
    return acc;
  }, notificationData);
};
