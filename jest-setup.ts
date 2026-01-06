import '@testing-library/react-native/extend-expect';

// @ts-ignore
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';

// Fix Test suite failed to run
// [@RNC/AsyncStorage]: NativeModule: AsyncStorage is null.
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('reactotron-react-native', () => ({
  setAsyncStorageHandler: jest.fn().mockReturnThis(),
  configure: jest.fn().mockReturnThis(),
  useReactNative: jest.fn().mockReturnThis(),
  connect: jest.fn(),
  log: jest.fn(),
  display: jest.fn(),
  error: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

// Mock @notifee/react-native
jest.mock('@notifee/react-native', () => {
  const mockNotifee = {
    requestPermission: jest.fn().mockResolvedValue({}),
    createChannel: jest.fn().mockResolvedValue('channel-id'),
    deleteChannel: jest.fn().mockResolvedValue(undefined),
    displayNotification: jest.fn().mockResolvedValue('notification-id'),
    onForegroundEvent: jest.fn().mockReturnValue(jest.fn()),
  };

  return {
    __esModule: true,
    default: mockNotifee,
    AndroidImportance: {
      LOW: 1,
      DEFAULT: 3,
      HIGH: 4,
    },
    AndroidStyle: {
      BIGTEXT: 1,
      BIGPICTURE: 2,
    },
    EventType: {
      PRESS: 1,
      ACTION_PRESS: 2,
    },
  };
});

// Mock @react-native-firebase modules
const mockFirebaseApp = {
  name: '[DEFAULT]',
  options: {},
};

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn().mockReturnValue({
    name: '[DEFAULT]',
    options: {},
  }),
  default: {
    app: jest.fn().mockReturnValue(mockFirebaseApp),
  },
}));

jest.mock('@react-native-firebase/messaging', () => {
  const mockMessagingInstance = {
    getToken: jest.fn().mockResolvedValue('mock-fcm-token'),
    isDeviceRegisteredForRemoteMessages: true,
    registerDeviceForRemoteMessages: jest.fn().mockResolvedValue(undefined),
    onMessage: jest.fn().mockReturnValue(jest.fn()),
    onNotificationOpenedApp: jest.fn().mockReturnValue(jest.fn()),
    getInitialNotification: jest.fn().mockResolvedValue(null),
  };
  const getMessaging = jest.fn(() => mockMessagingInstance);
  const registerDeviceForRemoteMessages = jest
    .fn()
    .mockResolvedValue(undefined);
  const getToken = jest.fn().mockResolvedValue('mock-fcm-token');

  return {
    __esModule: true,
    default: jest.fn(() => mockMessagingInstance),
    getMessaging,
    registerDeviceForRemoteMessages,
    getToken,
  };
});

// Mock react-native-permissions
jest.mock('react-native-permissions', () => ({
  PERMISSIONS: {
    ANDROID: {
      POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
    },
  },
  request: jest.fn().mockResolvedValue('granted'),
}));

// Mock react-native-device-info
jest.mock('react-native-device-info', () => {
  return {
    __esModule: true,
    default: {
      isEmulator: jest.fn().mockResolvedValue(false),
      getUniqueId: jest.fn().mockResolvedValue('mock-device-id'),
    },
  };
});

// Mock react-native-config
jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {
    ENVIRONMENT: 'test',
    API_BASE_URL: 'http://localhost:3000',
    STRAPI_BASE_URL: 'http://localhost:1337',
    REQUIRE_HTTPS: 'false',
  },
}));
