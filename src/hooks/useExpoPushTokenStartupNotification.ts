import { useEffect } from 'react';

import { scheduleExpoPushTokenStartupNoticeAsync } from '@app/services/notifications/scheduleExpoPushTokenStartupNotice';

let startupNoticeScheduled = false;

/**
 * On first mount (emulator **and** real device), requests notification permission and:
 *  - schedules a local "product spotlight" deep-link notification, and
 *  - on real devices only, registers the Expo push token for FCM.
 *
 * The module-level flag prevents duplicate scheduling under React Strict Mode / Fast Refresh.
 */
export function useExpoPushTokenStartupNotification(): void {
  useEffect(() => {
    if (startupNoticeScheduled) {
      return;
    }
    startupNoticeScheduled = true;

    scheduleExpoPushTokenStartupNoticeAsync().catch((e: unknown) => {
      if (__DEV__) {
        console.warn('[useExpoPushTokenStartupNotification]', e);
      }
    });
  }, []);
}
