/**
 * Notification Topics for Firebase Messaging
 */
export const NOTIFICATION_TOPICS = {
  ALL: 'all',
  PROMOTIONS: 'promotions',
  NEW_PRODUCTS: 'new_products',
} as const;

export type NotificationTopic =
  (typeof NOTIFICATION_TOPICS)[keyof typeof NOTIFICATION_TOPICS];
