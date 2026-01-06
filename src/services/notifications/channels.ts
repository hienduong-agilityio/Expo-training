// Notifee
import notifee from '@notifee/react-native';

// Constants
import { NOTIFICATION_CHANNELS } from '@app/constants/notification';

/**
 * Delete notification channel (ignore errors if channel doesn't exist)
 */
const deleteChannel = async (channelId: string): Promise<void> => {
  await notifee.deleteChannel(channelId).catch(() => undefined);
};

/**
 * Initialize notification channels
 */
export const initializeNotificationChannels = async (): Promise<void> => {
  const channelIds = NOTIFICATION_CHANNELS.map(channel => channel.id);

  await Promise.all(channelIds.map(deleteChannel));
  await Promise.all(
    NOTIFICATION_CHANNELS.map(channel => notifee.createChannel(channel)),
  );
};
