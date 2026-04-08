// Constants
import { NOTIFICATION_CHANNELS } from '@app/constants/notification';

/**
 * Delete notification channel (ignore errors if channel doesn't exist)
 */
const deleteChannel = async (_channelId: string): Promise<void> => undefined;

/**
 * Initialize notification channels
 */
export const initializeNotificationChannels = async (): Promise<void> => {
  const channelIds = NOTIFICATION_CHANNELS.map(channel => channel.id);

  await Promise.all(channelIds.map(deleteChannel));
};
