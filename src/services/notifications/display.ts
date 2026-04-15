import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Types
import type { NotificationData } from '@app/interfaces/notification';

// Helpers
import {
  buildNotificationDeepLink,
  convertNotificationDataToStrings,
  getChannelId,
} from '@app/helpers/notifications';

/**
 * Show a local notification (used when FCM delivers a foreground message).
 * Uses an Android notification channel id (Expo SDK 55 — avoid `trigger: null` on Android 8+ without a channel).
 *
 * @see https://docs.expo.dev/versions/v55.0.0/sdk/notifications/
 */
export type DisplayNotificationOptions = {
  /** Same id → Expo replaces instead of stacking many locals (foreground FCM path). */
  notificationIdentifier?: string;
};

export const displayNotification = async (
  data: NotificationData,
  options?: DisplayNotificationOptions,
) => {
  const deepLink = buildNotificationDeepLink(data);
  const payload = convertNotificationDataToStrings(data, deepLink);
  const channelId = getChannelId(data.type);

  const trigger: Notifications.NotificationTriggerInput =
    Platform.OS === 'android' ? { channelId } : null;

  await Notifications.scheduleNotificationAsync({
    ...(options?.notificationIdentifier && {
      identifier: options.notificationIdentifier,
    }),
    content: {
      title: data.title,
      body: data.body,
      data: payload,
      ...(Platform.OS === 'android' && {
        android: {
          channelId,
        },
      }),
    },
    trigger,
  });
};
