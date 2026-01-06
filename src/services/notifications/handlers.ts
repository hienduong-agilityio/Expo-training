// Notifee
import notifee, { EventType, type Event } from '@notifee/react-native';

// Types
import type { NotificationData } from '@app/interfaces/notification';

// Helpers
import {
  handleNotificationAction,
  openNotificationLink,
} from '@app/helpers/notifications';

/**
 * Unified event processor for notification events
 */
const processNotificationEvent = async (
  event: Event,
  onPress?: (data: NotificationData | undefined) => void,
  isBackground = false,
) => {
  const { type, detail } = event;
  const notificationData = detail.notification?.data as NotificationData;

  const handlePress = async () => {
    if (notificationData) {
      // Open deep link for foreground events with deepLink
      if (!isBackground && notificationData.deepLink) {
        await openNotificationLink(notificationData);
      }

      // Always open link for background events
      if (isBackground) {
        await openNotificationLink(notificationData);
      }
    }

    onPress?.(notificationData);
  };

  const handlers: Partial<Record<EventType, () => Promise<void> | void>> = {
    [EventType.PRESS]: handlePress,
    [EventType.ACTION_PRESS]: async () => {
      const actionId = detail.pressAction?.id;

      if (actionId && notificationData) {
        await handleNotificationAction(actionId, notificationData);
      }

      onPress?.(notificationData);
    },
  };

  await handlers[type]?.();
};

/**
 * Handle notification press events
 */
export const setupNotificationHandlers = (
  onNotificationPress?: (data: NotificationData | undefined) => void,
) => {
  return notifee.onForegroundEvent(event =>
    processNotificationEvent(event, onNotificationPress),
  );
};

/**
 * Handle background notification events
 */
export const setupBackgroundNotificationHandler = () => {
  notifee.onBackgroundEvent(event =>
    processNotificationEvent(event, undefined, true),
  );
};
