import { useEffect, useState } from 'react';
import { DevSettings, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

// Navigation
import { Navigation } from '@app/navigation';

// Contexts
import { queryClient } from '@app/contexts/query';

// Components
import { ToastContainer } from '@app/components/ToastContainer';
import { ConfirmModal } from '@app/components/ui/ConfirmModal';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [showStorybook, setShowStorybook] = useState(false);

  useEffect(() => {
    if (__DEV__) {
      // Toggle Storybook
      require('./ReactotronConfig');

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
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Navigation />
        <ToastContainer />
        <ConfirmModal />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
