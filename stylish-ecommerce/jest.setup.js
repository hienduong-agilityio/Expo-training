require('@testing-library/jest-native/extend-expect');
const { jest: jestGlobal } = require('@jest/globals');

jestGlobal.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
