import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { router, useRootNavigationState } from 'expo-router';

import { resolveNotificationHref } from '@app/hooks/notificationNavigation';
import { useStoreHydration } from '@app/hooks/useStoreHydration';
import { authStore } from '@app/stores/authStore';
import { deferredNavigationStore } from '@app/stores/deferredNavigationStore';

function handleNotificationOpen(
  notification: Notifications.Notification,
): void {
  const raw = notification.request.content.data;
  const data =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : undefined;

  const targetRoute = resolveNotificationHref(data);
  if (!targetRoute) {
    return;
  }

  const isSignedIn = Boolean(authStore.getState().accessToken);

  try {
    if (!isSignedIn) {
      deferredNavigationStore.getState().enqueueDeferredRoute(targetRoute);
      router.replace('/login');
    } else {
      router.push(targetRoute);
    }
    Notifications.clearLastNotificationResponse();
  } catch {
    if (__DEV__) {
      console.warn(
        '[useNotificationObserver] navigation failed for route:',
        targetRoute,
      );
    }
  }
}

export function useNotificationObserver(): void {
  const navigationState = useRootNavigationState();
  const authHydrated = useStoreHydration(authStore);
  const coldStartHandledRef = useRef(false);

  useEffect(() => {
    if (!navigationState?.key || !authHydrated) {
      return;
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        if (
          response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
        ) {
          handleNotificationOpen(response.notification);
        }
      },
    );

    if (!coldStartHandledRef.current) {
      coldStartHandledRef.current = true;
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
        handleNotificationOpen(initial.notification);
      }
    }

    return () => {
      subscription.remove();
    };
  }, [navigationState?.key, authHydrated]);
}
