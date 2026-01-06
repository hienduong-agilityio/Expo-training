/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { setupBackgroundNotificationHandler } from './src/services/notifications';

// Register background handler
setupBackgroundNotificationHandler();

let AppEntryPoint = App;

if (__DEV__ && process.env.LOAD_STORYBOOK === 'true') {
  const StorybookUIRoot = require('./.storybook/index').default;
  AppEntryPoint = StorybookUIRoot;
}

AppRegistry.registerComponent(appName, () => AppEntryPoint);
