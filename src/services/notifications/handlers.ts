// Types
import type { NotificationData } from '@app/interfaces/notification';

/**
 * Handle notification press events
 */
export const setupNotificationHandlers = (
  _onNotificationPress?: (data: NotificationData | undefined) => void,
) => {
  return () => undefined;
};

/**
 * Handle background notification events
 */
export const setupBackgroundNotificationHandler = () => {
  return undefined;
};
