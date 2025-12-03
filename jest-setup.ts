import '@testing-library/react-native/extend-expect';

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
