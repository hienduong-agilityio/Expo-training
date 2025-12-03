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

// Hooks
import { useHydration } from '@app/hooks/useHydration';

export const Navigation = () => {
  const { accessToken } = authStore();
  const { hydrated, isFirstLaunch } = useHydration(authStore);

  if (!hydrated || isFirstLaunch === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  const isAuth = Boolean(accessToken);

  return (
    <NavigationContainer>
      {isAuth ? (
        <PrivateStackNavigation />
      ) : (
        <PublicStackNavigation
          initialRouteName={
            isFirstLaunch ? PUBLIC_SCREENS.ONBOARDING : PUBLIC_SCREENS.LOGIN
          }
        />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
