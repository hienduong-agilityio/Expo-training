import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { router, useRootNavigationState } from 'expo-router';

import { getHrefFromNotificationData } from '@app/hooks/notificationNavigation';

function redirectFromNotification(
  notification: Notifications.Notification,
): void {
  const raw = notification.request.content.data;
  const data =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : undefined;

  const href = getHrefFromNotificationData(data);

  if (!href) {
    return;
  }

  try {
    router.push(href);
    Notifications.clearLastNotificationResponse();
  } catch {
    if (__DEV__) {
      console.warn(
        '[useNotificationObserver] navigation failed for href:',
        href,
      );
    }
  }
}

export function useNotificationObserver(): void {
  const navigationState = useRootNavigationState();
  const consumedInitialRef = useRef(false);

  useEffect(() => {
    if (!navigationState?.key) {
      return;
    }

    if (!consumedInitialRef.current) {
      consumedInitialRef.current = true;
      let initial: Notifications.NotificationResponse | null = null;
      try {
        initial = Notifications.getLastNotificationResponse();
      } catch {}

      if (
        initial?.notification &&
        initial.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
      ) {
        redirectFromNotification(initial.notification);
      }
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        if (
          response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
        ) {
          redirectFromNotification(response.notification);
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [navigationState?.key]);
}
