let performance: typeof import('react-native-performance').default | null =
  null;

if (__DEV__) {
  try {
    performance =
      require('react-native-performance').default ||
      require('react-native-performance');
  } catch {
    // Performance API not available
  }
}

const hasMark = (markName: string): boolean => {
  if (!__DEV__ || !performance) return false;

  try {
    return performance.getEntriesByName(markName, 'mark').length > 0;
  } catch {
    return false;
  }
};

const measure = (name: string, start: string, end: string): void => {
  if (!__DEV__ || !performance) return;
  if (!hasMark(start) || !hasMark(end)) return;

  try {
    performance.measure(name, start, end);
  } catch {
    // Ignore
  }
};

export const trackAppLaunch = (): void => {
  if (!__DEV__ || !performance) return;
  try {
    performance.mark('app-launch-start');
  } catch {
    // Ignore
  }
};

export const trackNavigationReady = (): void => {
  if (!__DEV__ || !performance) return;
  try {
    performance.mark('navigation-ready');
    measure('app-launch', 'app-launch-start', 'navigation-ready');
    measure('navigation-setup', 'app-launch-start', 'navigation-ready');
  } catch {
    // Ignore
  }
};

export const trackFirstScreen = (screenName: string): void => {
  if (!__DEV__ || !performance) return;
  try {
    performance.mark('first-screen-render');
    measure('app-tti', 'app-launch-start', 'first-screen-render');
    measure('app-first-screen', 'app-launch-start', 'first-screen-render');
    performance.metric('first-screen-name', screenName);
  } catch {
    // Ignore
  }
};

export const trackScreenTransition = (
  fromScreen: string,
  toScreen: string,
): void => {
  if (!__DEV__ || !performance) return;
  const id = `transition-${Date.now()}`;
  try {
    performance.mark(`${id}-start`);
    setTimeout(() => {
      if (!__DEV__ || !performance) return;
      try {
        performance.mark(`${id}-end`);
        measure('screen-transition', `${id}-start`, `${id}-end`);
        performance.metric('screen-transition', `${fromScreen} -> ${toScreen}`);
      } catch {
        // Ignore
      }
    }, 100);
  } catch {
    // Ignore
  }
};
