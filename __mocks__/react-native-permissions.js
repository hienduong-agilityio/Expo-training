/** Jest stub — used when `moduleNameMapper` redirects `react-native-permissions` (e.g. incomplete `node_modules`). */
module.exports = {
  PERMISSIONS: {
    ANDROID: {
      POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
    },
    IOS: {},
  },
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    LIMITED: 'limited',
    GRANTED: 'granted',
    BLOCKED: 'blocked',
  },
  request: jest.fn(() => Promise.resolve('granted')),
  check: jest.fn(() => Promise.resolve('granted')),
};
