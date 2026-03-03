import { Platform } from 'react-native';

function EmptyScreen() {
  return null;
}

// Only load on-device Storybook in dev mode on native platforms.
// Prevents .rnstorybook/storybook.requires start() side effect on web/production.
const StorybookUIRoot =
  __DEV__ && Platform.OS !== 'web' ? require('../../.rnstorybook').default : EmptyScreen;

export default StorybookUIRoot;
