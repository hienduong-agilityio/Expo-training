import { useEffect, useState } from 'react';

import { DevSettings, StatusBar, useColorScheme } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from './src/navigation';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [showStorybook, setShowStorybook] = useState(false);

  useEffect(() => {
    if (__DEV__) {
      // Toggle Storybook
      DevSettings.addMenuItem('Toggle Storybook', () => {
        setShowStorybook(prev => !prev);
      });
    }
  }, []);

  if (showStorybook) {
    const StorybookUI = require('./.storybook').default;
    return <StorybookUI />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Navigation />
      {/* <AppContent /> */}
    </SafeAreaProvider>
  );
};

export default App;
