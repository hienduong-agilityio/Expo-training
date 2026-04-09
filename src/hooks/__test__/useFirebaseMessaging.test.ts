import { renderHook } from '@testing-library/react-native';
import * as ExpoLinking from 'expo-linking';

// Hooks
import { useFirebaseMessaging } from '../useFirebaseMessaging';

// Services
import { getFcmToken, registerListenerWithFCM } from '@app/services/firebase';

// Helpers
import { buildNotificationDeepLink } from '@app/helpers/notifications';

// Stores
import { authStore } from '@app/stores/authStore';

jest.mock('expo-linking', () => ({
  canOpenURL: jest.fn(),
  openURL: jest.fn(),
  createURL: jest.fn(() => 'stylish://'),
}));

jest.mock('@app/services/firebase');
jest.mock('@app/services/user');
jest.mock('@app/stores/authStore');
jest.mock('@app/helpers/notifications', () => {
  const actual = jest.requireActual('@app/helpers/notifications');
  const LinkingModule = require('expo-linking');
  const mockBuildNotificationDeepLink = jest.fn();
  return {
    ...actual,
    buildNotificationDeepLink: mockBuildNotificationDeepLink,
    openNotificationLink: jest.fn(
      async (data: { deepLink?: string; [key: string]: unknown } | null) => {
        if (!data) return;
        const link = data.deepLink || mockBuildNotificationDeepLink(data);
        if (link && (await LinkingModule.canOpenURL(link).catch(() => false))) {
          await LinkingModule.openURL(link);
        }
      },
    ),
  };
});

describe('useFirebaseMessaging', () => {
  const mockUnsubscribe = jest.fn();
  const mockGetFcmToken = getFcmToken as jest.Mock;
  const mockRegisterListenerWithFCM = registerListenerWithFCM as jest.Mock;
  const mockBuildNotificationDeepLink = buildNotificationDeepLink as jest.Mock;
  const mockCanOpenURL = ExpoLinking.canOpenURL as jest.Mock;
  const mockOpenURL = ExpoLinking.openURL as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetFcmToken.mockResolvedValue('test-token');
    mockRegisterListenerWithFCM.mockReturnValue(mockUnsubscribe);
    mockCanOpenURL.mockResolvedValue(true);
    (authStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: { user?: { documentId?: string } }) => unknown) =>
        selector({ user: { documentId: 'test-user-id' } }),
    );
  });

  it('should get FCM token on mount', () => {
    renderHook(() => useFirebaseMessaging());

    expect(mockGetFcmToken).toHaveBeenCalled();
  });

  it('should register listener on mount', () => {
    renderHook(() => useFirebaseMessaging());

    expect(mockRegisterListenerWithFCM).toHaveBeenCalled();
  });

  it('should return unsubscribe function when listener returns function', () => {
    const { unmount } = renderHook(() => useFirebaseMessaging());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should handle case when listener returns undefined', () => {
    mockRegisterListenerWithFCM.mockReturnValue(undefined);

    const { unmount } = renderHook(() => useFirebaseMessaging());

    unmount();

    expect(mockUnsubscribe).not.toHaveBeenCalled();
  });

  it('should handle notification open with deep link', async () => {
    const mockNotificationData = {
      title: 'Test',
      body: 'Test body',
      deepLink: 'myapp://product/123',
    };

    mockBuildNotificationDeepLink.mockReturnValue('myapp://product/123');
    mockCanOpenURL.mockResolvedValue(true);

    renderHook(() => useFirebaseMessaging());

    const notificationCallback = mockRegisterListenerWithFCM.mock.calls[0][0];

    await notificationCallback(mockNotificationData);

    expect(mockCanOpenURL).toHaveBeenCalledWith('myapp://product/123');
    expect(mockOpenURL).toHaveBeenCalledWith('myapp://product/123');
  });

  it('should handle notification open without data', async () => {
    renderHook(() => useFirebaseMessaging());

    const notificationCallback = mockRegisterListenerWithFCM.mock.calls[0][0];

    await notificationCallback(null);

    expect(mockCanOpenURL).not.toHaveBeenCalled();
    expect(mockOpenURL).not.toHaveBeenCalled();
  });

  it('should handle notification open without deep link', async () => {
    const mockNotificationData = {
      title: 'Test',
      body: 'Test body',
    };

    mockBuildNotificationDeepLink.mockReturnValue(undefined);

    renderHook(() => useFirebaseMessaging());

    const notificationCallback = mockRegisterListenerWithFCM.mock.calls[0][0];

    await notificationCallback(mockNotificationData);

    expect(mockCanOpenURL).not.toHaveBeenCalled();
    expect(mockOpenURL).not.toHaveBeenCalled();
  });

  it('should handle case when canOpenURL returns false', async () => {
    const mockNotificationData = {
      title: 'Test',
      body: 'Test body',
      deepLink: 'myapp://product/123',
    };

    mockBuildNotificationDeepLink.mockReturnValue('myapp://product/123');
    mockCanOpenURL.mockResolvedValue(false);

    renderHook(() => useFirebaseMessaging());

    const notificationCallback = mockRegisterListenerWithFCM.mock.calls[0][0];

    await notificationCallback(mockNotificationData);

    expect(mockCanOpenURL).toHaveBeenCalledWith('myapp://product/123');
    expect(mockOpenURL).not.toHaveBeenCalled();
  });

  it('should handle case when canOpenURL throws error', async () => {
    const mockNotificationData = {
      title: 'Test',
      body: 'Test body',
      deepLink: 'myapp://product/123',
    };

    mockBuildNotificationDeepLink.mockReturnValue('myapp://product/123');
    mockCanOpenURL.mockRejectedValue(new Error('Network error'));

    renderHook(() => useFirebaseMessaging());

    const notificationCallback = mockRegisterListenerWithFCM.mock.calls[0][0];

    await notificationCallback(mockNotificationData);

    expect(mockCanOpenURL).toHaveBeenCalledWith('myapp://product/123');
    expect(mockOpenURL).not.toHaveBeenCalled();
  });

  it('should handle notification with built deep link', async () => {
    const mockNotificationData = {
      title: 'Test',
      body: 'Test body',
      documentId: 'product-123',
    };

    mockBuildNotificationDeepLink.mockReturnValue(
      'myapp://product/product-123',
    );
    mockCanOpenURL.mockResolvedValue(true);

    renderHook(() => useFirebaseMessaging());

    const notificationCallback = mockRegisterListenerWithFCM.mock.calls[0][0];

    await notificationCallback(mockNotificationData);

    expect(mockBuildNotificationDeepLink).toHaveBeenCalledWith(
      mockNotificationData,
    );
    expect(mockCanOpenURL).toHaveBeenCalledWith('myapp://product/product-123');
    expect(mockOpenURL).toHaveBeenCalledWith('myapp://product/product-123');
  });
});
