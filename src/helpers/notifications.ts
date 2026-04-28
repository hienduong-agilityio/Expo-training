import * as Linking from 'expo-linking';

// Types
import type { NotificationData } from '@app/interfaces/notification';

// Enums
import { NotificationType, NotificationChannel } from '@app/enums/notification';

// Constants
import {
  DEEP_LINK_PATHS,
  DEEP_LINK_BY_TYPE,
  NOTIFICATION_STYLES,
  CHANNEL_MAPPING,
  PRODUCT_LIST_TYPE_LABELS,
  NOTIFICATION_ACTION_IDS,
} from '@app/constants/notification';

// Helpers
import { safeString } from './converters';

export const buildNotificationDeepLink = (
  data: NotificationData,
): string | undefined => {
  const { deepLink, documentId, productId, productListType, type } = data;

  if (deepLink) return deepLink;

  const productIdentifier = documentId || productId;
  if (productIdentifier) return DEEP_LINK_PATHS.PRODUCT(productIdentifier);

  if (productListType) return DEEP_LINK_PATHS.PRODUCTS(productListType);

  return (type && DEEP_LINK_BY_TYPE[type]) || DEEP_LINK_PATHS.HOME;
};

/**
 * Open deep link from notification data
 */
export const openNotificationLink = async (
  data: NotificationData | null | undefined,
): Promise<void> => {
  if (!data) {
    return;
  }

  const link = data.deepLink || buildNotificationDeepLink(data);

  if (link && (await Linking.canOpenURL(link).catch(() => false))) {
    await Linking.openURL(link);
  }
};

export const buildNotificationSubtitle = (data: NotificationData): string => {
  const { couponCode, discount, productListType } = data;

  if (couponCode) return `Coupon Code: ${couponCode}`;
  if (discount) return `Save ${discount}%`;
  if (productListType)
    return PRODUCT_LIST_TYPE_LABELS[productListType] || 'Product List';

  return '';
};

/**
 * Convert all notification data fields to strings for Notifee
 */
export const convertNotificationDataToStrings = (
  data: NotificationData,
  deepLink?: string,
): Record<string, string> => {
  const baseData = {
    ...data,
    productId: data.documentId || data.productId,
    deepLink: deepLink || data.deepLink,
    timestamp: data.timestamp || Date.now(),
  };

  return Object.entries(baseData).reduce(
    (acc, [key, value]) => {
      const strValue = safeString(value);

      if (strValue !== undefined) {
        acc[key] = strValue;
      }

      return acc;
    },
    {} as Record<string, string>,
  );
};

export const getNotificationStyle = (type: NotificationType) => {
  return (
    NOTIFICATION_STYLES[type] || NOTIFICATION_STYLES[NotificationType.GENERAL]
  );
};

export const getChannelId = (type: NotificationType): string => {
  return CHANNEL_MAPPING[type] || NotificationChannel.GENERAL;
};

const ACTION_HANDLERS: Record<
  string,
  (data: NotificationData) => Promise<void>
> = {
  [NOTIFICATION_ACTION_IDS.VIEW_PRODUCT]: openNotificationLink,
  [NOTIFICATION_ACTION_IDS.VIEW_PROMOTION]: openNotificationLink,
  [NOTIFICATION_ACTION_IDS.VIEW_PRODUCT_LIST]: openNotificationLink,
  [NOTIFICATION_ACTION_IDS.ADD_TO_CART]: openNotificationLink,
};

export const handleNotificationAction = async (
  actionId: string,
  notificationData?: NotificationData,
): Promise<void> => {
  if (!notificationData) {
    return;
  }

  const handler = ACTION_HANDLERS[actionId];

  if (handler) {
    await handler(notificationData);
  }
};
