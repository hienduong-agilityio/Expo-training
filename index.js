/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import appJson from './app.json';

const appName = appJson.expo?.name ?? appJson.name;
import { setupBackgroundNotificationHandler } from './src/services/notifications';

// Register background handler
setupBackgroundNotificationHandler();

let AppEntryPoint = App;

if (__DEV__) {
  if (process.env.LOAD_STORYBOOK === 'true') {
    const StorybookUIRoot = require('./.storybook/index').default;
    AppEntryPoint = StorybookUIRoot;
  }
}

AppRegistry.registerComponent(appName, () => AppEntryPoint);
