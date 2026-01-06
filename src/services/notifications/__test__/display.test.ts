import notifee, {
  AndroidImportance,
  AndroidStyle,
} from '@notifee/react-native';
import { displayNotification } from '../display';
import {
  getNotificationActions,
  NOTIFICATION_DISPLAY,
} from '@app/constants/notification';
import {
  NotificationType,
  NotificationPriority,
} from '@app/enums/notification';
import type { NotificationData } from '@app/interfaces/notification';
import {
  getNotificationStyle,
  getChannelId,
  buildNotificationDeepLink,
  buildNotificationSubtitle,
  convertNotificationDataToStrings,
} from '@app/helpers/notifications';

jest.mock('@notifee/react-native');
jest.mock('@app/constants/notification');
jest.mock('@app/helpers/notifications');

describe('display', () => {
  const mockRequestPermission =
    notifee.requestPermission as jest.MockedFunction<
      typeof notifee.requestPermission
    >;
  const mockDisplayNotification =
    notifee.displayNotification as jest.MockedFunction<
      typeof notifee.displayNotification
    >;
  const mockGetNotificationStyle = getNotificationStyle as jest.MockedFunction<
    typeof getNotificationStyle
  >;
  const mockGetChannelId = getChannelId as jest.MockedFunction<
    typeof getChannelId
  >;
  const mockBuildNotificationDeepLink =
    buildNotificationDeepLink as jest.MockedFunction<
      typeof buildNotificationDeepLink
    >;
  const mockBuildNotificationSubtitle =
    buildNotificationSubtitle as jest.MockedFunction<
      typeof buildNotificationSubtitle
    >;
  const mockConvertNotificationDataToStrings =
    convertNotificationDataToStrings as jest.MockedFunction<
      typeof convertNotificationDataToStrings
    >;
  const mockGetNotificationActions =
    getNotificationActions as jest.MockedFunction<
      typeof getNotificationActions
    >;

  const mockNotificationData: NotificationData = {
    type: NotificationType.GENERAL,
    title: 'Test Title',
    body: 'Test Body',
    timestamp: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestPermission.mockResolvedValue({
      authorizationStatus: 1,
    } as Awaited<ReturnType<typeof notifee.requestPermission>>);
    mockDisplayNotification.mockResolvedValue('notification-id');
    mockGetNotificationStyle.mockReturnValue({
      backgroundColor: '#000000',
      textColor: '#ffffff',
      accentColor: '#ff0000',
    });
    mockGetChannelId.mockReturnValue('general');
    mockBuildNotificationDeepLink.mockReturnValue('myapp://test');
    mockBuildNotificationSubtitle.mockReturnValue('Subtitle');
    mockConvertNotificationDataToStrings.mockReturnValue({
      deepLink: 'myapp://test',
    });
    mockGetNotificationActions.mockReturnValue([]);
  });

  describe('displayNotification', () => {
    it('should display notification with all fields', async () => {
      await displayNotification(mockNotificationData);

      expect(mockRequestPermission).toHaveBeenCalled();
      expect(mockGetNotificationStyle).toHaveBeenCalledWith(
        NotificationType.GENERAL,
      );
      expect(mockGetChannelId).toHaveBeenCalledWith(NotificationType.GENERAL);
      expect(mockBuildNotificationDeepLink).toHaveBeenCalledWith(
        mockNotificationData,
      );
      expect(mockBuildNotificationSubtitle).toHaveBeenCalledWith(
        mockNotificationData,
      );
      expect(mockConvertNotificationDataToStrings).toHaveBeenCalledWith(
        mockNotificationData,
        'myapp://test',
      );
      expect(mockDisplayNotification).toHaveBeenCalled();
    });

    it('should use default priority when not provided', async () => {
      await displayNotification(mockNotificationData);

      const callArgs = mockDisplayNotification.mock.calls[0][0];
      expect(callArgs?.android?.autoCancel).toBe(true);
    });

    it('should handle LOW priority correctly', async () => {
      const dataWithLowPriority: NotificationData = {
        ...mockNotificationData,
        priority: NotificationPriority.LOW,
      };

      await displayNotification(dataWithLowPriority);

      const callArgs = mockDisplayNotification.mock.calls[0][0];
      expect(callArgs?.android?.autoCancel).toBe(false);
    });

    it('should use BIGPICTURE style when imageUrl is provided', async () => {
      const dataWithImage: NotificationData = {
        ...mockNotificationData,
        imageUrl: 'https://example.com/image.jpg',
      };

      await displayNotification(dataWithImage);

      const callArgs = mockDisplayNotification.mock.calls[0][0];
      expect(callArgs?.android?.style).toEqual({
        type: AndroidStyle.BIGPICTURE,
        picture: 'https://example.com/image.jpg',
        title: 'Test Title',
        summary: 'Test Body',
      });
      expect(callArgs?.android?.largeIcon).toBe(
        'https://example.com/image.jpg',
      );
    });

    it('should use BIGTEXT style when imageUrl is not provided', async () => {
      await displayNotification(mockNotificationData);

      const callArgs = mockDisplayNotification.mock.calls[0][0];
      expect(callArgs?.android?.style).toEqual({
        type: AndroidStyle.BIGTEXT,
        text: 'Test Body',
      });
      expect(callArgs?.android?.largeIcon).toBeUndefined();
    });

    it('should include notification actions', async () => {
      const mockActions = [
        {
          title: 'View',
          pressAction: { id: 'view' },
        },
      ];
      mockGetNotificationActions.mockReturnValue(
        mockActions as ReturnType<typeof getNotificationActions>,
      );

      await displayNotification(mockNotificationData);

      const callArgs = mockDisplayNotification.mock.calls[0][0];
      expect(callArgs?.android?.actions).toEqual(mockActions);
      expect(mockGetNotificationActions).toHaveBeenCalledWith(
        NotificationType.GENERAL,
      );
    });

    it('should set correct Android configuration', async () => {
      await displayNotification(mockNotificationData);

      const callArgs = mockDisplayNotification.mock.calls[0][0];
      expect(callArgs?.android?.channelId).toBe('general');
      expect(callArgs?.android?.importance).toBe(AndroidImportance.HIGH);
      expect(callArgs?.android?.pressAction).toEqual({
        id: NOTIFICATION_DISPLAY.PRESS_ACTION_ID,
        launchActivity: NOTIFICATION_DISPLAY.LAUNCH_ACTIVITY,
        mainComponent: NOTIFICATION_DISPLAY.MAIN_COMPONENT,
      });
      expect(callArgs?.android?.color).toBe('#ff0000');
      expect(callArgs?.android?.smallIcon).toBe(
        NOTIFICATION_DISPLAY.SMALL_ICON,
      );
      expect(callArgs?.android?.showTimestamp).toBe(true);
      expect(callArgs?.android?.vibrationPattern).toEqual([
        ...NOTIFICATION_DISPLAY.VIBRATION_PATTERN,
      ]);
      expect(callArgs?.android?.sound).toBe(NOTIFICATION_DISPLAY.SOUND);
      expect(callArgs?.android?.visibility).toBe(
        NOTIFICATION_DISPLAY.VISIBILITY,
      );
      expect(callArgs?.android?.asForegroundService).toBe(false);
    });

    it('should set notification title, body, subtitle, and data', async () => {
      await displayNotification(mockNotificationData);

      const callArgs = mockDisplayNotification.mock.calls[0][0];
      expect(callArgs?.title).toBe('Test Title');
      expect(callArgs?.body).toBe('Test Body');
      expect(callArgs?.subtitle).toBe('Subtitle');
      expect(callArgs?.data).toEqual({
        deepLink: 'myapp://test',
      });
    });

    it('should handle different notification types', async () => {
      const types = [
        NotificationType.PRICE_DROP,
        NotificationType.PROMOTION,
        NotificationType.CART_ABANDONMENT,
      ];

      for (const type of types) {
        jest.clearAllMocks();
        const data: NotificationData = {
          ...mockNotificationData,
          type,
        };

        await displayNotification(data);

        expect(mockGetNotificationStyle).toHaveBeenCalledWith(type);
        expect(mockGetChannelId).toHaveBeenCalledWith(type);
        expect(mockGetNotificationActions).toHaveBeenCalledWith(type);
      }
    });
  });
});
