import AsyncStorage from '@react-native-async-storage/async-storage';

let StorybookUIRoot = () => null;

if (__DEV__) {
  const { view } = require('./storybook.requires');

  StorybookUIRoot = view.getStorybookUI({
    storage: {
      getItem: AsyncStorage.getItem,
      setItem: AsyncStorage.setItem,
    },
  });
}

export default StorybookUIRoot;
