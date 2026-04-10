import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { initializeNotificationChannels } from '../channels';

describe('channels', () => {
  const setChannel = Notifications.setNotificationChannelAsync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeNotificationChannels', () => {
    it('should resolve without throwing', async () => {
      await expect(initializeNotificationChannels()).resolves.toBeUndefined();
    });

    it('does not call setNotificationChannelAsync on iOS', async () => {
      const prev = Platform.OS;
      Object.defineProperty(Platform, 'OS', {
        configurable: true,
        value: 'ios',
      });
      try {
        await initializeNotificationChannels();
        expect(setChannel).not.toHaveBeenCalled();
      } finally {
        Object.defineProperty(Platform, 'OS', {
          configurable: true,
          value: prev,
        });
      }
    });

    it('creates all channels on Android', async () => {
      const prev = Platform.OS;
      Object.defineProperty(Platform, 'OS', {
        configurable: true,
        value: 'android',
      });
      try {
        await initializeNotificationChannels();
        expect(setChannel).toHaveBeenCalledTimes(4);
        expect(setChannel).toHaveBeenCalledWith(
          'general',
          expect.objectContaining({ name: 'General Notifications' }),
        );
      } finally {
        Object.defineProperty(Platform, 'OS', {
          configurable: true,
          value: prev,
        });
      }
    });
  });
});
