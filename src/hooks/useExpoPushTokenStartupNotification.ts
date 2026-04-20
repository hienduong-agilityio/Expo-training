import { useEffect } from 'react';

import { scheduleExpoPushTokenStartupNoticeAsync } from '@app/services/notifications/scheduleExpoPushTokenStartupNotice';

let devStartupTokenNoticeScheduled = false;

/**
 * On first mount in __DEV__, schedules one local notification with the device Expo push token
 * so login and other screens stay unobstructed (avoids duplicate under React Strict Mode).
 */
export function useExpoPushTokenStartupNotification(): void {
  useEffect(() => {
    if (!__DEV__ || devStartupTokenNoticeScheduled) {
      return;
    }
    devStartupTokenNoticeScheduled = true;

    scheduleExpoPushTokenStartupNoticeAsync().catch((e: unknown) => {
      if (__DEV__) {
        console.warn('[useExpoPushTokenStartupNotification]', e);
      }
    });
  }, []);
}
