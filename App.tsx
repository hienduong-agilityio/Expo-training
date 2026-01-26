import { useEffect, useState } from 'react';
import { DevSettings, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

// Hooks
import { useTanStackQueryDevTools } from '@rozenite/tanstack-query-plugin';
import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin';
import { usePerformanceMonitorDevTools } from '@rozenite/performance-monitor-plugin';

// Navigation
import { Navigation } from '@app/navigation';

// Contexts
import { queryClient } from '@app/contexts/query';

// Components
import { ToastContainer } from '@app/components/ToastContainer';
import { ConfirmModal } from '@app/components/ui/ConfirmModal';
import { NoInternetModal } from '@app/components/NoInternetModal/index';

// Hooks
import { useNetworkStatus } from '@app/hooks/useNetworkStatus';

// Config
import { trackAppLaunch } from '@app/config/performance';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [showStorybook, setShowStorybook] = useState(false);
  const { isConnected, showOfflineModal, closeModal } = useNetworkStatus();

  useTanStackQueryDevTools(queryClient);
  useNetworkActivityDevTools();
  usePerformanceMonitorDevTools();

  useEffect(() => {
    if (__DEV__) {
      DevSettings?.addMenuItem?.('Toggle Storybook', () => {
        setShowStorybook(prev => !prev);
      });
      trackAppLaunch();
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
        <NoInternetModal
          visible={!isConnected && showOfflineModal}
          onClose={closeModal}
        />
        <ToastContainer />
        <ConfirmModal />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
