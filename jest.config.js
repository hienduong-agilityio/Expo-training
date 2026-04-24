// Must run before any test file imports expo-modules-core (Platform.ts warns if unset).
process.env.EXPO_OS = process.env.EXPO_OS || 'ios';

module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.(ttf|otf)$': '<rootDir>/__mocks__/fileMock.js',
    '^test-utils$': '<rootDir>/test-utils.tsx',
    '^react-native-permissions$':
      '<rootDir>/__mocks__/react-native-permissions.js',
    '^expo-notifications$': '<rootDir>/__mocks__/expo-notifications.js',
    '^react-native/Libraries/Core/Devtools/getDevServer$':
      '<rootDir>/__mocks__/react-native-getDevServer.js',
  },
  // Aligned with current suite output; raise gradually as you add tests.
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 55,
      functions: 75,
      lines: 70,
    },
  },
  transformIgnorePatterns: [
    '/node_modules/(?!((jest-)?react-native|@react-native(-community)?)|react-clone-referenced-element|react-navigation|@react-navigation/.*|expo-router|expo(nent)?|@expo/.*|expo-modules-core|expo-image|expo-linking)',
  ],
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/services/**/*.{ts,tsx}',
    'src/utils/**/*.{ts,tsx}',
    '!**/*.stories.{ts,tsx}',
    '!src/components/ui/index.ts',
    '!src/components/ui/ProductList/index.ts',
    '!src/services/notifications/index.ts',
  ],
  moduleDirectories: [
    'node_modules',
    // add the directory with the test-utils.js file, for example:
    'utils', // a utility folder
    __dirname, // the root directory
  ],
  setupFiles: ['<rootDir>/jest-setup-expo-global.ts'],
  setupFilesAfterEnv: ['./jest-setup.ts'],
};
