import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { NotificationChannel } from '@app/enums/notification';

import { tryGetExpoPushTokenAsync } from './expoPushRegister';

const STARTUP_NOTICE_DELAY_SEC = 2;

/**
 * Schedules a **local** notification (after a short delay) showing the Expo push token
 * or a short error reason (e.g. simulator). Intended for development visibility without UI overlay.
 */
export async function scheduleExpoPushTokenStartupNoticeAsync(): Promise<void> {
  const result = await tryGetExpoPushTokenAsync();

  const title = 'ExponentPushToken';
  const body = result.ok ? result.token : result.message;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: result.ok ? { kind: 'expo-push-token', token: result.token } : { kind: 'expo-push-token-error' },
      ...(Platform.OS === 'android'
        ? { android: { channelId: NotificationChannel.GENERAL } }
        : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: STARTUP_NOTICE_DELAY_SEC,
    },
  });
}
