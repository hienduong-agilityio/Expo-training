import { useEffect, useCallback } from 'react';

// Services
import {
  getFcmToken,
  registerListenerWithFCM,
  subscribeToDefaultTopics,
} from '@app/services/firebase';
import { syncFcmToken } from '@app/services/user';

// Stores
import { authStore } from '@app/stores/authStore';

// Helpers
import { openNotificationLink } from '@app/helpers/notifications';

/**
 * Hook to handle Firebase Cloud Messaging
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
    // Register listeners first
    const unsubscribe = registerListenerWithFCM(
      openNotificationLink,
      handleTokenSync,
    );

    // Only sync if we have a valid userId
    if (userId) {
      getFcmToken().then(token => {
        if (token) {
          handleTokenSync(token);
          subscribeToDefaultTopics();
        }
      });
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [userId, handleTokenSync]);
};
