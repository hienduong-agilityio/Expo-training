module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.(ttf|otf)$': '<rootDir>/__mocks__/fileMock.js',
    '^test-utils$': '<rootDir>/test-utils.tsx',
    '^react-native-permissions$':
      '<rootDir>/__mocks__/react-native-permissions.js',
    '^expo-notifications$': '<rootDir>/__mocks__/expo-notifications.js',
  },
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
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
