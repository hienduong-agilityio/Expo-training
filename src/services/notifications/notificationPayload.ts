import type { Notification } from 'expo-notifications';

// Enums
import { NotificationType } from '@app/enums/notification';

// Constants
import { NOTIFICATION_DEFAULTS } from '@app/constants/notification';

// Types
import type {
  NotificationData,
  RemoteNotificationPayload,
} from '@app/interfaces/notification';

// Helpers
import { safeString, safeNumber } from '@app/helpers/converters';

/**
 * Maps Firebase / Expo remote fields into the app’s `NotificationData` (navigation, copy, extras).
 */
export const mapExpoNotificationToRemotePayload = (
  expoNotification: Notification,
): RemoteNotificationPayload => {
  const { content } = expoNotification.request;
  const rawData = (content.data ?? {}) as Record<string, unknown>;

  const stringData = Object.entries(rawData).reduce<
    Record<string, string | undefined>
  >((accumulator, [key, value]) => {
    if (value !== undefined && value !== null) {
      accumulator[key] = typeof value === 'string' ? value : String(value);
    }
    return accumulator;
  }, {});

  return {
    data: stringData,
    notification: {
      title: content.title ?? undefined,
      body: content.body ?? undefined,
    },
  };
};

/**
 * Parse remote payload into app `NotificationData`.
 */
export const parseRemotePayloadToNotificationData = (
  remotePayload: RemoteNotificationPayload,
): NotificationData => {
  const { data: payloadData = {}, notification: notificationBlock } =
    remotePayload;

  const baseRecord: NotificationData = {
    type: (payloadData.type as NotificationType) || NotificationType.GENERAL,
    title:
      notificationBlock?.title ||
      safeString(payloadData.title) ||
      NOTIFICATION_DEFAULTS.TITLE,
    body:
      notificationBlock?.body ||
      safeString(payloadData.body) ||
      NOTIFICATION_DEFAULTS.BODY,
    imageUrl:
      notificationBlock?.android?.imageUrl || safeString(payloadData.imageUrl),
    deepLink: safeString(payloadData.deepLink),
    productId: safeString(payloadData.productId),
    documentId: safeString(payloadData.documentId),
    productListType: safeString(
      payloadData.productListType,
    ) as NotificationData['productListType'],
    couponCode: safeString(payloadData.couponCode),
    discount: safeNumber(payloadData.discount),
    priority: safeString(payloadData.priority) as NotificationData['priority'],
    timestamp: Date.now(),
  };

  return Object.entries(payloadData).reduce<NotificationData>(
    (accumulator, [key, value]) => {
      if (!(key in accumulator)) {
        const asString = safeString(value);
        if (asString !== undefined) {
          accumulator[key] = asString;
        }
      }
      return accumulator;
    },
    baseRecord,
  );
};
