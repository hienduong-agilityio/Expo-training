import * as Notifications from 'expo-notifications';

// Types
import type { NotificationData } from '@app/interfaces/notification';

import { notificationDataFromExpoContent } from './expoContent';

let presentationHandlerRegistered = false;

const ensurePresentationHandler = () => {
  if (presentationHandlerRegistered) {
    return;
  }
  presentationHandlerRegistered = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
};

/**
 * Subscribe to Expo notification responses (e.g. user opened a local notification).
 */
export const setupNotificationHandlers = (
  onNotificationPress?: (data: NotificationData | undefined) => void,
) => {
  ensurePresentationHandler();

  const subscription = Notifications.addNotificationResponseReceivedListener(
    response => {
      const content = response.notification.request.content;
      const data = notificationDataFromExpoContent(content);
      onNotificationPress?.(data);
    },
  );

  return () => subscription.remove();
};

/**
 * Reserved for Expo task-based background delivery; FCM uses native handlers in `listeners.ts`.
 */
export const setupBackgroundNotificationHandler = () => {
  return undefined;
};
