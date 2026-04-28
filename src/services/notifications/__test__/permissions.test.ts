import * as Notifications from 'expo-notifications';

import { ensureExpoNotificationPermissionsAsync } from '../permissions';

describe('ensureExpoNotificationPermissionsAsync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns existing status when already granted', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: 'granted',
    });

    await expect(ensureExpoNotificationPermissionsAsync()).resolves.toBe(
      'granted',
    );
    expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });

  it('requests permissions when not yet granted', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: 'undetermined',
    });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
      status: 'granted',
    });

    await expect(ensureExpoNotificationPermissionsAsync()).resolves.toBe(
      'granted',
    );
    expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
  });
});
