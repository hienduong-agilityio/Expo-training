/** Jest stub for `expo-notifications`. */
const subscription = { remove: jest.fn() };

module.exports = {
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
  getPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true }),
  ),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true }),
  ),
  getDevicePushTokenAsync: jest.fn(() =>
    Promise.resolve({ type: 'android', data: 'mock-device-push-token' }),
  ),
  addNotificationResponseReceivedListener: jest.fn(() => subscription),
  addNotificationReceivedListener: jest.fn(() => subscription),
  addPushTokenListener: jest.fn(() => subscription),
  getLastNotificationResponseAsync: jest.fn(() => Promise.resolve(null)),
  subscribeToTopicAsync: jest.fn(() => Promise.resolve(null)),
  unsubscribeFromTopicAsync: jest.fn(() => Promise.resolve(null)),
};
