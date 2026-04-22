import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { EXPO_NOTIFICATION_ANDROID_ACCENT } from '@app/constants/notification';
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
            ...(Platform.OS === 'android' && {
              color: EXPO_NOTIFICATION_ANDROID_ACCENT,
            }),
          }),
          trigger: Platform.OS === 'android' ? { channelId: 'general' } : null,
        }),
      );
    });

    it('passes identifier when provided so duplicates can replace', async () => {
      await displayNotification(mockNotificationData, {
        notificationIdentifier: 'stable-id-1',
      });

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          identifier: 'stable-id-1',
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
