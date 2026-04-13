import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Constants
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_DISPLAY,
} from '@app/constants/notification';

const channelImportance = (
  channelId: string,
): Notifications.AndroidImportance => {
  if (channelId === 'general') {
    return Notifications.AndroidImportance.DEFAULT;
  }
  return Notifications.AndroidImportance.HIGH;
};

/**
 * Create Android notification channels (required before Android 13 permission prompt
 * and for channel-scoped local notifications). No-op on iOS.
 *
 * @see https://docs.expo.dev/versions/v55.0.0/sdk/notifications/
 */
export const initializeNotificationChannels = async (): Promise<void> => {
  if (Platform.OS !== 'android') {
    return;
  }

  await Promise.all(
    NOTIFICATION_CHANNELS.map(channel =>
      Notifications.setNotificationChannelAsync(channel.id, {
        name: channel.name,
        description: channel.description,
        importance: channelImportance(channel.id),
        enableVibrate: true,
        vibrationPattern: [...NOTIFICATION_DISPLAY.VIBRATION_PATTERN],
        showBadge: true,
      }),
    ),
  );
};
