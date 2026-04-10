import { displayNotification } from '../display';
import { NotificationType } from '@app/enums/notification';
import type { NotificationData } from '@app/interfaces/notification';
import { buildNotificationDeepLink } from '@app/helpers/notifications';

jest.mock('@app/helpers/notifications');

describe('display', () => {
  const mockBuildNotificationDeepLink =
    buildNotificationDeepLink as jest.MockedFunction<
      typeof buildNotificationDeepLink
    >;

  const mockNotificationData: NotificationData = {
    type: NotificationType.GENERAL,
    title: 'Test Title',
    body: 'Test Body',
    timestamp: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockBuildNotificationDeepLink.mockReturnValue('myapp://test');
  });

  describe('displayNotification', () => {
    it('should call deep link builder', async () => {
      await displayNotification(mockNotificationData);
      expect(mockBuildNotificationDeepLink).toHaveBeenCalledWith(
        mockNotificationData,
      );
    });

    it('should resolve for different notification types', async () => {
      await expect(
        displayNotification({
          ...mockNotificationData,
          type: NotificationType.PROMOTION,
        }),
      ).resolves.not.toThrow();
    });
  });
});
