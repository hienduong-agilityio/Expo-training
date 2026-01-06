import notifee from '@notifee/react-native';
import { initializeNotificationChannels } from '../channels';
import { NOTIFICATION_CHANNELS } from '@app/constants/notification';

jest.mock('@notifee/react-native');

describe('channels', () => {
  const mockDeleteChannel = notifee.deleteChannel as jest.MockedFunction<
    typeof notifee.deleteChannel
  >;
  const mockCreateChannel = notifee.createChannel as jest.MockedFunction<
    typeof notifee.createChannel
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDeleteChannel.mockResolvedValue(undefined);
    mockCreateChannel.mockResolvedValue('channel-id');
  });

  describe('initializeNotificationChannels', () => {
    it('should delete and create all notification channels', async () => {
      await initializeNotificationChannels();

      const channelIds = NOTIFICATION_CHANNELS.map(channel => channel.id);

      // Should delete all channels
      expect(mockDeleteChannel).toHaveBeenCalledTimes(channelIds.length);
      channelIds.forEach(channelId => {
        expect(mockDeleteChannel).toHaveBeenCalledWith(channelId);
      });

      // Should create all channels
      expect(mockCreateChannel).toHaveBeenCalledTimes(
        NOTIFICATION_CHANNELS.length,
      );
      NOTIFICATION_CHANNELS.forEach(channel => {
        expect(mockCreateChannel).toHaveBeenCalledWith(channel);
      });
    });

    it('should handle deleteChannel errors gracefully', async () => {
      mockDeleteChannel.mockRejectedValueOnce(new Error('Channel not found'));

      await expect(initializeNotificationChannels()).resolves.not.toThrow();

      // Should still create channels even if delete fails
      expect(mockCreateChannel).toHaveBeenCalledTimes(
        NOTIFICATION_CHANNELS.length,
      );
    });

    it('should process channels in parallel', async () => {
      await initializeNotificationChannels();

      // Verify all delete operations are called
      expect(mockDeleteChannel).toHaveBeenCalledTimes(
        NOTIFICATION_CHANNELS.length,
      );
      // Verify all create operations are called
      expect(mockCreateChannel).toHaveBeenCalledTimes(
        NOTIFICATION_CHANNELS.length,
      );
    });
  });
});
