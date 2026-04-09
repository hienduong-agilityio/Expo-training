import '@testing-library/react-native/extend-expect';

// @ts-ignore
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';

// Fix Test suite failed to run
// [@RNC/AsyncStorage]: NativeModule: AsyncStorage is null.
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

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
      isEmulatorSync: jest.fn(() => false),
      getUniqueId: jest.fn().mockResolvedValue('mock-device-id'),
    },
  };
});

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-notifications', () => ({
  AndroidImportance: {
    UNKNOWN: 0,
    UNSPECIFIED: 1,
    NONE: 2,
    MIN: 3,
    LOW: 4,
    DEFAULT: 5,
    HIGH: 6,
    MAX: 7,
  },
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('mock-id')),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve(null)),
  addNotificationResponseReceivedListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [true, null]),
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(() => Promise.resolve()),
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock(
  'expo/virtual/env',
  () => ({
    env: {
      EXPO_PUBLIC_API_BASE_URL: '',
      EXPO_PUBLIC_STRAPI_BASE_URL: '',
    },
  }),
  { virtual: true },
);
