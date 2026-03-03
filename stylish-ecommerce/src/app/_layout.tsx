import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

import StorybookUIRoot from '@root/.rnstorybook';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isWeb = Platform.OS === 'web';
  const [showStorybook, setShowStorybook] = useState(false);
  const setShowStorybookRef = useRef(setShowStorybook);
  setShowStorybookRef.current = setShowStorybook;

  useEffect(() => {
    if (!__DEV__ || isWeb) return;
    // Lazy require prevents expo-dev-menu from being bundled on web/production
    // eslint-disable-next-line @typescript-eslint/no-require-imports
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
    return <StorybookUIRoot />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
