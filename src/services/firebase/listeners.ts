// React Native Firebase
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  onTokenRefresh,
} from '@react-native-firebase/messaging';

// Services
import {
  displayNotification,
  setupNotificationHandlers,
} from '@app/services/notifications';
import { parseNotificationData } from '@app/services/firebase/parser';
import { ensureDefaultFirebaseApp } from '@app/services/firebase/firebase';

// Constants
import { NOTIFICATION_TIMING } from '@app/constants/notification';

// Types
import type {
  NotificationData,
  RemoteMessage,
} from '@app/interfaces/notification';

/**
 * Common handler for processing remote messages
 */
const handleRemoteMessage = async (
  remoteMessage: RemoteMessage,
  onOpen?: (data: NotificationData) => void,
  isInitial = false,
) => {
  const data = parseNotificationData(remoteMessage);

  // Delay for initial notification to ensure app is ready
  if (isInitial) {
    setTimeout(
      () => onOpen?.(data),
      NOTIFICATION_TIMING.INITIAL_NOTIFICATION_DELAY,
    );
  } else {
    onOpen?.(data);
  }
};

/**
 * Register FCM listeners using modular API
 */
export const registerListenerWithFCM = (
  onNotificationOpen?: (data: NotificationData) => void,
  onTokenRefreshCallback?: (token: string) => void,
): (() => void) | undefined => {
  try {
    const app = ensureDefaultFirebaseApp();
    const messaging = getMessaging(app);

    const unsubscribers = [
      setupNotificationHandlers(
        onNotificationOpen as (data: NotificationData | undefined) => void,
      ),
      onMessage(messaging, remoteMessage => {
        const data = parseNotificationData(remoteMessage);

        if (data.title?.trim()) {
          displayNotification({
            ...data,
            body: data.body?.trim() ? data.body : ' ',
          }).catch(() => undefined);
        }
      }),
      onNotificationOpenedApp(messaging, remoteMessage =>
        handleRemoteMessage(remoteMessage, onNotificationOpen),
      ),
      // Handle token refresh using modular API
      onTokenRefresh(messaging, token => {
        onTokenRefreshCallback?.(token);
      }),
    ];

    // Handle FCM initial notification (quit state)
    getInitialNotification(messaging).then(remoteMessage => {
      if (remoteMessage) {
        handleRemoteMessage(remoteMessage, onNotificationOpen, true);
      }
    });

    return () => unsubscribers.forEach(unsub => unsub?.());
  } catch {
    return undefined;
  }
};
