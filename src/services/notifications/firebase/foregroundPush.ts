import * as Notifications from 'expo-notifications';

import type { NotificationData } from '@app/interfaces/notification';

import { displayNotification } from '../display';
import {
  mapExpoNotificationToRemotePayload,
  parseRemotePayloadToNotificationData,
} from '../notificationPayload';
import {
  buildNotificationScheduleIdentifier,
  shouldSkipRepeatedForegroundBanner,
  shouldSkipRepeatedRemotePush,
} from './pushIdentity';

const resolveDisplayTitleAndBody = (
  data: NotificationData,
): { title: string; body: string } | null => {
  const trimmedTitle = data.title?.trim() ?? '';
  const trimmedBody = data.body?.trim() ?? '';
  if (!trimmedTitle && !trimmedBody) {
    return null;
  }
  return {
    title: trimmedTitle || trimmedBody || ' ',
    body: trimmedBody || trimmedTitle || ' ',
  };
};

export const presentForegroundRemotePush = async (
  notification: Notifications.Notification,
): Promise<void> => {
  try {
    if (shouldSkipRepeatedRemotePush(notification)) {
      return;
    }

    const remotePayload = mapExpoNotificationToRemotePayload(notification);
    const notificationData =
      parseRemotePayloadToNotificationData(remotePayload);
    const display = resolveDisplayTitleAndBody(notificationData);
    if (!display) {
      return;
    }

    if (shouldSkipRepeatedForegroundBanner(display.title, display.body)) {
      return;
    }

    await displayNotification(
      { ...notificationData, title: display.title, body: display.body },
      {
        notificationIdentifier: buildNotificationScheduleIdentifier(
          notification,
          display.title,
          display.body,
        ),
      },
    );
  } catch {
    /* native listener must not throw */
  }
};
