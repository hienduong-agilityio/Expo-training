import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isWeb = Platform.OS === 'web';
  const [showStorybook, setShowStorybook] = useState(false);
  const setShowStorybookRef = useRef(setShowStorybook);
  setShowStorybookRef.current = setShowStorybook;

  useEffect(() => {
    if (!__DEV__ || isWeb) return;
    // Lazy require prevents expo-dev-menu from being bundled on web/production
    const { registerDevMenuItems } = require('expo-dev-menu');
    registerDevMenuItems([
      {
        name: 'Toggle Storybook',
        callback: () => setShowStorybookRef.current((prev) => !prev),
        shouldCollapse: true,
      },
    ]).catch(() => {});
  }, [isWeb]);

  if (__DEV__ && !isWeb && showStorybook) {
    // Lazy require prevents Storybook's start() side effect on web/production
    const StorybookUIRoot = require('../../.rnstorybook').default;
    return <StorybookUIRoot />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
