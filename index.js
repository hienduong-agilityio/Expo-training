/**
 * @format
 */

import { registerRootComponent } from 'expo';
import App from './App';
import { setupBackgroundNotificationHandler } from './src/services/notifications';

setupBackgroundNotificationHandler();

let AppEntryPoint = App;

if (__DEV__) {
  if (process.env.LOAD_STORYBOOK === 'true') {
    const StorybookUIRoot = require('./.storybook/index').default;
    AppEntryPoint = StorybookUIRoot;
  }
}

registerRootComponent(AppEntryPoint);
