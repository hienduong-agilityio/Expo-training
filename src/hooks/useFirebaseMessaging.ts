import { useEffect, useCallback, useRef } from 'react';

// Services
import {
  deliverPendingQuitStateNotification,
  ensureExpoNotificationPermissionsAsync,
  getFcmToken,
  initializeNotificationChannels,
  registerListenerWithFCM,
  subscribeToDefaultTopics,
} from '@app/services/notifications';
import { syncFcmToken } from '@app/services/user';

// Stores
import { authStore } from '@app/stores/authStore';

// Helpers
import { openNotificationLink } from '@app/helpers/notifications';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

const isTestEnv =
  typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

const LISTENER_RETRY_DELAYS_MS = isTestEnv
  ? [0, 0, 0, 0, 0]
  : [0, 120, 400, 1000, 2000];

const TOKEN_RETRY_DELAYS_MS = isTestEnv ? [0, 0, 0] : [0, 300, 800];

/**
 * Push registration and listeners using Expo (`expo-notifications` + device token),
 * aligned with https://docs.expo.dev/guides/using-firebase/ (Firebase JS for other
 * products; push is not `firebase/messaging` on native).
 */
export const useFirebaseMessaging = () => {
  const user = authStore(state => state.user);
  const userId = user?.documentId || user?.id;

  const handleTokenSync = useCallback(
    async (token: string) => {
      if (userId && token) {
        await syncFcmToken(userId, token);
      }
    },
    [userId],
  );

  const handleTokenSyncRef = useRef(handleTokenSync);
  useEffect(() => {
    handleTokenSyncRef.current = handleTokenSync;
  }, [handleTokenSync]);

  useEffect(() => {
    let cancelled = false;
    let removeListeners: (() => void) | undefined;

    async function setupPushMessaging(): Promise<void> {
      try {
        await initializeNotificationChannels();
      } catch {
        // Channels are Android-only; failure is non-fatal for the rest of setup.
      }

      // Android 13+ / iOS: must grant before FCM listeners and getDevicePushTokenAsync behave reliably.
      try {
        await ensureExpoNotificationPermissionsAsync();
      } catch {
        // Permission dialog failed or was denied.
      }

      if (cancelled) {
        return;
      }

      for (const ms of LISTENER_RETRY_DELAYS_MS) {
        if (cancelled) {
          return;
        }
        if (ms > 0) {
          await delay(ms);
        }
        removeListeners = registerListenerWithFCM(
          openNotificationLink,
          token => {
            Promise.resolve(handleTokenSyncRef.current(token)).catch(() => {
              /* sync errors handled inside ref */
            });
          },
        );
        if (removeListeners) {
          break;
        }
      }

      try {
        await deliverPendingQuitStateNotification(openNotificationLink);
      } catch {
        // Cold-start response is unavailable in some environments (e.g. tests).
      }

      if (cancelled) {
        return;
      }

      // Native FCM/APNs token must be requested even when the user is logged out.
      // Gating token retrieval on `userId` prevented FCM registration and broke Firebase
      // Console delivery / topic targeting for many sessions.
      let token: string | undefined;
      for (const ms of TOKEN_RETRY_DELAYS_MS) {
        if (cancelled) {
          return;
        }
        if (ms > 0) {
          await delay(ms);
        }
        try {
          token = await getFcmToken();
        } catch {
          token = undefined;
        }
        if (token) {
          break;
        }
      }

      if (!token || cancelled) {
        return;
      }

      if (userId) {
        try {
          await handleTokenSyncRef.current(token);
        } catch {
          // Backend rejected token sync; user can retry on next launch.
        }
      }

      try {
        await subscribeToDefaultTopics();
      } catch {
        // Topics are Android-only in Expo; iOS is a no-op here.
      }
    }

    setupPushMessaging().catch(() => {
      // Errors inside `setupPushMessaging` are handled locally; this only guards unexpected throws.
    });

    return () => {
      cancelled = true;
      removeListeners?.();
    };
  }, [userId]);
};
