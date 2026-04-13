import { useEffect, useCallback } from 'react';

// Services
import {
  getFcmToken,
  registerListenerWithFCM,
  subscribeToDefaultTopics,
} from '@app/services/firebase';
import {
  ensureExpoNotificationPermissionsAsync,
  initializeNotificationChannels,
} from '@app/services/notifications';
import { syncFcmToken } from '@app/services/user';

// Stores
import { authStore } from '@app/stores/authStore';

// Helpers
import { openNotificationLink } from '@app/helpers/notifications';

const delay = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });

const isTestEnv =
  typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

const LISTENER_RETRY_DELAYS_MS = isTestEnv
  ? [0, 0, 0, 0, 0]
  : [0, 120, 400, 1000, 2000];

const TOKEN_RETRY_DELAYS_MS = isTestEnv ? [0, 0, 0] : [0, 300, 800];

/**
 * Hook to handle Firebase Cloud Messaging + Expo local notifications.
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

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    (async () => {
      await initializeNotificationChannels().catch(() => undefined);

      for (const ms of LISTENER_RETRY_DELAYS_MS) {
        if (cancelled) return;
        if (ms > 0) await delay(ms);
        unsubscribe = registerListenerWithFCM(
          openNotificationLink,
          handleTokenSync,
        );
        if (unsubscribe) break;
      }

      await ensureExpoNotificationPermissionsAsync().catch(() => undefined);

      if (!userId || cancelled) return;

      let token: string | undefined;
      for (const ms of TOKEN_RETRY_DELAYS_MS) {
        if (cancelled) return;
        if (ms > 0) await delay(ms);
        token = await getFcmToken().catch(() => undefined);
        if (token) break;
      }

      if (!token || cancelled) return;

      await handleTokenSync(token).catch(() => undefined);
      await subscribeToDefaultTopics().catch(() => undefined);
    })().catch(() => undefined);

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [userId, handleTokenSync]);
};
