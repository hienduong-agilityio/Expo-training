import '@testing-library/react-native/extend-expect';

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('@rozenite/tanstack-query-plugin', () => ({
  useTanStackQueryDevTools: jest.fn(),
}));
jest.mock('@rozenite/network-activity-plugin', () => ({
  useNetworkActivityDevTools: jest.fn(),
}));
jest.mock('@rozenite/performance-monitor-plugin', () => ({
  usePerformanceMonitorDevTools: jest.fn(),
}));

jest.mock('expo-device', () => ({
  isDevice: true,
}));

jest.mock('expo-application', () => ({
  getAndroidId: jest.fn(() => 'mock-android-id'),
  getIosIdForVendorAsync: jest.fn(() => Promise.resolve('mock-ios-idfv')),
  applicationId: 'com.test.app',
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
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

jest.mock('expo-linking', () => ({
  __esModule: true,
  collectManifestSchemes: jest.fn(() => []),
  createURL: jest.fn((path: string) => `https://app.test${path}`),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(() => Promise.resolve()),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
  parse: jest.fn(),
}));

jest.mock('expo-image', () => {
  const { Image } = require('react-native');
  return {
    __esModule: true,
    Image,
  };
});

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
