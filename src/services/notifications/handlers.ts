import * as Notifications from 'expo-notifications';

// Types
import type { NotificationData } from '@app/interfaces/notification';

import { notificationDataFromExpoContent } from './expoContent';

const presentation = { registered: false };

const ensurePresentationHandler = () => {
  if (presentation.registered) {
    return;
  }
  presentation.registered = true;
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
      Promise.resolve(onNotificationPress?.(data)).catch(() => {
        /* deep link / handler may reject; avoid uncaught promise from native callback */
      });
    },
  );

  return () => subscription.remove();
};

/**
 * Reserved for Expo task-based background delivery; foreground FCM is handled in `push.ts`.
 */
export const setupBackgroundNotificationHandler = () => {
  return undefined;
};
