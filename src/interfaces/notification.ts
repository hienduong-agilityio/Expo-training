import type {
  NotificationType,
  NotificationPriority,
} from '@app/enums/notification';

// Types
import type { ProductListType } from '@app/constants/product';

/**
 * Payload shaped like FCM (data map + optional notification block) after reading an Expo notification.
 * Used by `parseRemotePayloadToNotificationData` in `notificationPayload.ts`.
 */
export interface RemoteNotificationPayload {
  data?: Record<string, string | undefined>;
  notification?: {
    title?: string;
    body?: string;
    android?: { imageUrl?: string };
  };
}

export interface NotificationData {
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  body: string;
  imageUrl?: string;
  deepLink?: string;
  productId?: string;
  documentId?: string;
  couponCode?: string;
  discount?: number;
  productListType?: ProductListType; // For navigating to product list screens (new-arrivals, trending, deal-of-day, etc.)
  timestamp?: number;
  [key: string]: unknown;
}

export interface NotificationChannelConfig {
  id: string;
  name: string;
  description: string;
  importance: number;
  sound?: string;
  vibration?: boolean;
  lights?: boolean;
  badge?: boolean;
}

export interface NotificationStyle {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  icon?: string;
  largeIcon?: string;
}
