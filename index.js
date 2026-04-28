/**
 * @format
 */

import { setupBackgroundNotificationHandler } from './src/services/notifications';

setupBackgroundNotificationHandler();

if (__DEV__ && process.env.LOAD_STORYBOOK === 'true') {
  const { registerRootComponent } = require('expo');
  const StorybookUIRoot = require('./.storybook/index').default;
  registerRootComponent(StorybookUIRoot);
} else {
  require('expo-router/entry');
}
