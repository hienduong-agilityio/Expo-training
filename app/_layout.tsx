import { useEffect, useState } from 'react';
import {
  DevSettings,
  StatusBar,
  useColorScheme,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';

import { getFirebaseApp } from '@app/config/firebase';
import { useAppFonts } from '@app/config/fonts';
import { useTanStackQueryDevTools } from '@rozenite/tanstack-query-plugin';
import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin';
import { usePerformanceMonitorDevTools } from '@rozenite/performance-monitor-plugin';

import { queryClient } from '@app/contexts/query';
import { ToastContainer } from '@app/components/ToastContainer';
import { ConfirmModal } from '@app/components/ui/ConfirmModal';
import { NoInternetModal } from '@app/components/NoInternetModal/index';
import { useNetworkStatus } from '@app/hooks/useNetworkStatus';
import { trackAppLaunch } from '@app/config/performance';
import { useFirebaseMessaging } from '@app/hooks/useFirebaseMessaging';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const FirebaseMessagingRoot = () => {
  useFirebaseMessaging();
  return null;
}

getFirebaseApp();
export default function RootLayout() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showStorybook, setShowStorybook] = useState(false);
  const { isConnected, showOfflineModal, closeModal } = useNetworkStatus();
  const [fontsLoaded, fontError] = useAppFonts();

  useTanStackQueryDevTools(queryClient);
  useNetworkActivityDevTools();
  usePerformanceMonitorDevTools();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (__DEV__) {
      DevSettings?.addMenuItem?.('Toggle Storybook', () => {
        setShowStorybook(prev => !prev);
      });
      trackAppLaunch();
    }
  }, []);

  if (showStorybook) {
    const StorybookUI = require('../.storybook').default;
    return <StorybookUI />;
  }

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <FirebaseMessagingRoot />
        <Stack screenOptions={{ headerShown: false }} />
        <NoInternetModal
          visible={!isConnected && showOfflineModal}
          onClose={closeModal}
        />
        <ToastContainer />
        <ConfirmModal />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
