import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { displayNotification } from '../display';
import { NotificationType } from '@app/enums/notification';
import type { NotificationData } from '@app/interfaces/notification';

describe('display', () => {
  const mockNotificationData: NotificationData = {
    type: NotificationType.GENERAL,
    title: 'Test Title',
    body: 'Test Body',
    timestamp: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('displayNotification', () => {
    it('schedules a local notification with content and platform-appropriate trigger', async () => {
      await displayNotification(mockNotificationData);

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Test Title',
            body: 'Test Body',
            data: expect.objectContaining({
              type: NotificationType.GENERAL,
              title: 'Test Title',
              body: 'Test Body',
            }),
          }),
          trigger: Platform.OS === 'android' ? { channelId: 'general' } : null,
        }),
      );
    });

    it('resolves for different notification types', async () => {
      await expect(
        displayNotification({
          ...mockNotificationData,
          type: NotificationType.PROMOTION,
        }),
      ).resolves.toBeUndefined();

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Test Title',
            body: 'Test Body',
          }),
        }),
      );
    });
  });
});
