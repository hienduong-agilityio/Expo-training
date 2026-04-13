import { useEffect, useState } from 'react';
import { DevSettings, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';

import { useAppFonts } from '@app/config/fonts';

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

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [showStorybook, setShowStorybook] = useState(false);
  const { isConnected, showOfflineModal, closeModal } = useNetworkStatus();
  const [fontsLoaded, fontError] = useAppFonts();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontError]);

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

  if (!fontsLoaded && !fontError) {
    return null;
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
