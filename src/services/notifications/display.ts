// Notifee
import notifee, {
  AndroidImportance,
  AndroidStyle,
} from '@notifee/react-native';

// Constants
import {
  getNotificationActions,
  NOTIFICATION_DISPLAY,
} from '@app/constants/notification';

// Enums
import { NotificationPriority } from '@app/enums/notification';

// Types
import type { NotificationData } from '@app/interfaces/notification';

// Helpers
import {
  buildNotificationDeepLink,
  buildNotificationSubtitle,
  convertNotificationDataToStrings,
  getNotificationStyle,
  getChannelId,
} from '@app/helpers/notifications';

/**
 * Display notification with custom styling
 */
export const displayNotification = async (data: NotificationData) => {
  const {
    title,
    body,
    imageUrl,
    type,
    priority = NotificationPriority.NORMAL,
  } = data;

  await notifee.requestPermission();

  const styleConfig = getNotificationStyle(type);
  const channelId = getChannelId(type);
  const deepLink = buildNotificationDeepLink(data);
  const subtitle = buildNotificationSubtitle(data);
  const notificationData = convertNotificationDataToStrings(data, deepLink);

  const androidStyle = imageUrl
    ? {
        type: AndroidStyle.BIGPICTURE as const,
        picture: imageUrl,
        title,
        summary: body,
      }
    : {
        type: AndroidStyle.BIGTEXT as const,
        text: body,
      };

  await notifee.displayNotification({
    title,
    body,
    subtitle,
    data: notificationData,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: NOTIFICATION_DISPLAY.PRESS_ACTION_ID,
        launchActivity: NOTIFICATION_DISPLAY.LAUNCH_ACTIVITY,
        mainComponent: NOTIFICATION_DISPLAY.MAIN_COMPONENT,
      },
      style: androidStyle,
      color: styleConfig.accentColor,
      smallIcon: NOTIFICATION_DISPLAY.SMALL_ICON,
      ...(imageUrl && { largeIcon: imageUrl }),
      actions: getNotificationActions(type),
      autoCancel: priority !== NotificationPriority.LOW,
      showTimestamp: true,
      vibrationPattern: [...NOTIFICATION_DISPLAY.VIBRATION_PATTERN],
      sound: NOTIFICATION_DISPLAY.SOUND,
      visibility: NOTIFICATION_DISPLAY.VISIBILITY,
      asForegroundService: false,
    },
  });
};
