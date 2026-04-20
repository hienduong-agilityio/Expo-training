import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { type Href, router } from 'expo-router';

function redirectFromNotification(notification: Notifications.Notification): void {
  const data = notification.request.content.data;
  const url = data && typeof data === 'object' && 'url' in data ? data.url : undefined;
  if (typeof url !== 'string' || url.length === 0) {
    return;
  }
  try {
    router.push(url as Href);
    Notifications.clearLastNotificationResponse();
  } catch {
    if (__DEV__) {
      console.warn('[useNotificationObserver] navigation failed for url:', url);
    }
  }
}

/**
 * Opens in-app routes from notification `data.url` (cold start + tap).
 * Payload example: `{ "url": "/(tabs)/home" }` — must be a valid expo-router href.
 */
export function useNotificationObserver(): void {
  useEffect(() => {
    let initial: Notifications.NotificationResponse | null = null;
    try {
      initial = Notifications.getLastNotificationResponse();
    } catch {
      // Unavailable in some environments (e.g. limited Expo Go support).
    }

    if (
      initial?.notification &&
      initial.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      redirectFromNotification(initial.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        redirectFromNotification(response.notification);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
