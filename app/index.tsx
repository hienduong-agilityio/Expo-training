import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';

import { authStore } from '@app/stores/authStore';
import { useFirstLaunch } from '@app/hooks/useFirstLaunch';
import { useStoreHydration } from '@app/hooks/useStoreHydration';

export default function Index() {
  const hydrated = useStoreHydration(authStore);
  const isFirstLaunch = useFirstLaunch();
  const accessToken = authStore(state => state.accessToken);
  const isAuth = Boolean(accessToken);

  if (!hydrated || isFirstLaunch === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isAuth) {
    return <Redirect href="/home" />;
  }

  if (isFirstLaunch) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
