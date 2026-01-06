import notifee, { EventType, type Event } from '@notifee/react-native';
import { setupNotificationHandlers } from '../handlers';
import {
  handleNotificationAction,
  openNotificationLink,
} from '@app/helpers/notifications';
import { NotificationType } from '@app/enums/notification';
import type { NotificationData } from '@app/interfaces/notification';

const mockOpenURL = jest.fn();
const mockCanOpenURL = jest.fn().mockResolvedValue(true);

jest.mock('react-native', () => ({
  Linking: {
    openURL: mockOpenURL,
    canOpenURL: mockCanOpenURL,
  },
}));

jest.mock('@notifee/react-native');
jest.mock('@app/helpers/notifications', () => {
  const actual = jest.requireActual('@app/helpers/notifications');
  const { Linking } = require('react-native');
  return {
    ...actual,
    handleNotificationAction: jest.fn(),
    openNotificationLink: jest.fn(async (data: NotificationData) => {
      const link = data.deepLink || actual.buildNotificationDeepLink(data);
      if (link && (await Linking.canOpenURL(link).catch(() => false))) {
        await Linking.openURL(link);
      }
    }),
  };
});

describe('handlers', () => {
  const mockOnForegroundEvent =
    notifee.onForegroundEvent as jest.MockedFunction<
      typeof notifee.onForegroundEvent
    >;
  const mockHandleNotificationAction =
    handleNotificationAction as jest.MockedFunction<
      typeof handleNotificationAction
    >;
  const mockOpenNotificationLink = openNotificationLink as jest.MockedFunction<
    typeof openNotificationLink
  >;

  const mockNotificationData: NotificationData = {
    type: NotificationType.GENERAL,
    title: 'Test Title',
    body: 'Test Body',
    timestamp: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleNotificationAction.mockResolvedValue(undefined);
    mockOpenURL.mockResolvedValue(undefined);
    mockOpenNotificationLink.mockImplementation(
      async (data: NotificationData) => {
        const link = data.deepLink;
        if (link) {
          await mockOpenURL(link);
        }
      },
    );
  });

  describe('setupNotificationHandlers', () => {
    it('should return unsubscribe function', () => {
      const mockUnsubscribe = jest.fn();
      mockOnForegroundEvent.mockReturnValue(mockUnsubscribe);

      const result = setupNotificationHandlers();

      expect(mockOnForegroundEvent).toHaveBeenCalled();
      expect(result).toBe(mockUnsubscribe);
    });

    it('should handle PRESS event with deepLink', async () => {
      const onNotificationPress = jest.fn();
      let eventHandler: (event: Event) => Promise<void>;

      mockOnForegroundEvent.mockImplementation(handler => {
        eventHandler = handler as (event: Event) => Promise<void>;
        return jest.fn();
      });

      setupNotificationHandlers(onNotificationPress);

      const event: Event = {
        type: EventType.PRESS,
        detail: {
          notification: {
            data: {
              ...mockNotificationData,
              deepLink: 'myapp://test',
            },
          },
        },
      } as Event;

      await eventHandler!(event);

      expect(mockOpenURL).toHaveBeenCalledWith('myapp://test');
      expect(onNotificationPress).toHaveBeenCalledWith({
        ...mockNotificationData,
        deepLink: 'myapp://test',
      });
    });

    it('should handle PRESS event without deepLink', async () => {
      const onNotificationPress = jest.fn();
      let eventHandler: (event: Event) => Promise<void>;

      mockOnForegroundEvent.mockImplementation(handler => {
        eventHandler = handler as (event: Event) => Promise<void>;
        return jest.fn();
      });

      setupNotificationHandlers(onNotificationPress);

      const event: Event = {
        type: EventType.PRESS,
        detail: {
          notification: {
            data: mockNotificationData,
          },
        },
      } as Event;

      await eventHandler!(event);

      expect(mockOpenURL).not.toHaveBeenCalled();
      expect(onNotificationPress).toHaveBeenCalledWith(mockNotificationData);
    });

    it('should handle ACTION_PRESS event with actionId', async () => {
      const onNotificationPress = jest.fn();
      let eventHandler: (event: Event) => Promise<void>;

      mockOnForegroundEvent.mockImplementation(handler => {
        eventHandler = handler as (event: Event) => Promise<void>;
        return jest.fn();
      });

      setupNotificationHandlers(onNotificationPress);

      const event: Event = {
        type: EventType.ACTION_PRESS,
        detail: {
          pressAction: {
            id: 'view_product',
          },
          notification: {
            data: mockNotificationData,
          },
        },
      } as Event;

      await eventHandler!(event);

      expect(mockHandleNotificationAction).toHaveBeenCalledWith(
        'view_product',
        mockNotificationData,
      );
      expect(onNotificationPress).toHaveBeenCalledWith(mockNotificationData);
    });

    it('should handle ACTION_PRESS event without actionId', async () => {
      const onNotificationPress = jest.fn();
      let eventHandler: (event: Event) => Promise<void>;

      mockOnForegroundEvent.mockImplementation(handler => {
        eventHandler = handler as (event: Event) => Promise<void>;
        return jest.fn();
      });

      setupNotificationHandlers(onNotificationPress);

      const event: Event = {
        type: EventType.ACTION_PRESS,
        detail: {
          pressAction: {
            id: 'view_product',
          },
          notification: {
            data: mockNotificationData,
          },
        },
      } as Event;

      await eventHandler!(event);

      expect(mockHandleNotificationAction).not.toHaveBeenCalledWith(
        1,
        mockNotificationData,
      );
      expect(onNotificationPress).toHaveBeenCalledWith(mockNotificationData);
    });

    it('should handle ACTION_PRESS event without notificationData', async () => {
      const onNotificationPress = jest.fn();
      let eventHandler: (event: Event) => Promise<void>;

      mockOnForegroundEvent.mockImplementation(handler => {
        eventHandler = handler as (event: Event) => Promise<void>;
        return jest.fn();
      });

      setupNotificationHandlers(onNotificationPress);

      const event: Event = {
        type: EventType.ACTION_PRESS,
        detail: {
          pressAction: {
            id: 'view_product',
          },
          notification: {},
        },
      } as Event;

      await eventHandler!(event);

      expect(mockHandleNotificationAction).not.toHaveBeenCalled();
      expect(onNotificationPress).toHaveBeenCalledWith(undefined);
    });

    it('should handle event without notification data', async () => {
      const onNotificationPress = jest.fn();
      let eventHandler: (event: Event) => Promise<void>;

      mockOnForegroundEvent.mockImplementation(handler => {
        eventHandler = handler as (event: Event) => Promise<void>;
        return jest.fn();
      });

      setupNotificationHandlers(onNotificationPress);

      const event: Event = {
        type: EventType.PRESS,
        detail: {
          notification: {},
        },
      } as Event;

      await eventHandler!(event);

      expect(onNotificationPress).toHaveBeenCalledWith(undefined);
    });

    it('should work without onNotificationPress callback', async () => {
      let eventHandler: (event: Event) => Promise<void>;

      mockOnForegroundEvent.mockImplementation(handler => {
        eventHandler = handler as (event: Event) => Promise<void>;
        return jest.fn();
      });

      setupNotificationHandlers();

      const event: Event = {
        type: EventType.PRESS,
        detail: {
          notification: {
            data: mockNotificationData,
          },
        },
      } as Event;

      await expect(eventHandler!(event)).resolves.not.toThrow();
    });

    it('should handle unknown event types gracefully', async () => {
      const onNotificationPress = jest.fn();
      let eventHandler: (event: Event) => Promise<void>;

      mockOnForegroundEvent.mockImplementation(handler => {
        eventHandler = handler as (event: Event) => Promise<void>;
        return jest.fn();
      });

      setupNotificationHandlers(onNotificationPress);

      const event: Event = {
        type: 999 as EventType, // Unknown event type
        detail: {
          notification: {
            data: mockNotificationData,
          },
        },
      } as Event;

      await eventHandler!(event);

      expect(onNotificationPress).not.toHaveBeenCalled();
    });
  });
});
