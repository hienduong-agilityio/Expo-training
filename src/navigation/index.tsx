import { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Components
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Stores
import { authStore } from '@app/stores/authStore';

// Navigation
import { PrivateStackNavigation } from '@app/navigation/PrivateNavigation';
import { PublicStackNavigation } from '@app/navigation/PublicNavigation';

// Constants
import { PUBLIC_SCREENS } from '@app/constants';

// Linking
import { linking } from './linking';

// Hooks
import { useFirstLaunch } from '@app/hooks/useFirstLaunch';
import { useStoreHydration } from '@app/hooks/useStoreHydration';
import { useFirebaseMessaging } from '@app/hooks/useFirebaseMessaging';

// Config
import { setupNavigationTracking } from '@app/config/performance';

interface NavigationContentProps {
  isFirstLaunch: boolean;
}
const NavigationContent = ({ isFirstLaunch }: NavigationContentProps) => {
  useFirebaseMessaging();
  const accessToken = authStore(state => state.accessToken);
  const isAuth = Boolean(accessToken);

  const initialRouteName = isFirstLaunch
    ? PUBLIC_SCREENS.ONBOARDING
    : PUBLIC_SCREENS.LOGIN;

  const navigationTracking = useMemo(() => setupNavigationTracking(), []);

  return (
    <NavigationContainer
      linking={linking}
      onReady={navigationTracking.onReady}
      onStateChange={navigationTracking.onStateChange}>
      {isAuth ? (
        <PrivateStackNavigation />
      ) : (
        <PublicStackNavigation initialRouteName={initialRouteName} />
      )}
    </NavigationContainer>
  );
};

export const Navigation = () => {
  const hydrated = useStoreHydration(authStore);
  const isFirstLaunch = useFirstLaunch();

  if (!hydrated || isFirstLaunch === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
  return <NavigationContent isFirstLaunch={isFirstLaunch} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
