import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Types
import type { NotificationData } from '@app/interfaces/notification';

// Constants
import { EXPO_NOTIFICATION_ANDROID_ACCENT } from '@app/constants/notification';

// Helpers
import {
  buildNotificationDeepLink,
  convertNotificationDataToStrings,
  getChannelId,
} from '@app/helpers/notifications';

export type DisplayNotificationOptions = {
  notificationIdentifier?: string;
  delaySeconds?: number;
  subtitle?: string;
  androidAccentColor?: string;
};

export const displayNotification = async (
  data: NotificationData,
  options?: DisplayNotificationOptions,
) => {
  const deepLink = buildNotificationDeepLink(data);
  const payload = convertNotificationDataToStrings(data, deepLink);
  const channelId = getChannelId(data.type);

  const delay =
    typeof options?.delaySeconds === 'number' && options.delaySeconds > 0
      ? options.delaySeconds
      : 0;

  const trigger: Notifications.NotificationTriggerInput =
    delay > 0
      ? {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: delay,
          ...(Platform.OS === 'android' ? { channelId } : {}),
        }
      : Platform.OS === 'android'
        ? { channelId }
        : null;

  const androidColor =
    options?.androidAccentColor ?? EXPO_NOTIFICATION_ANDROID_ACCENT;

  await Notifications.scheduleNotificationAsync({
    ...(options?.notificationIdentifier && {
      identifier: options.notificationIdentifier,
    }),
    content: {
      title: data.title,
      ...(options?.subtitle ? { subtitle: options.subtitle } : {}),
      body: data.body,
      data: payload,
      ...(Platform.OS === 'android' && { color: androidColor }),
    },
    trigger,
  });
};
