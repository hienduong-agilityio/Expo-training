import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { authStore } from '@app/stores/authStore';
import { deferredNavigationStore } from '@app/stores/deferredNavigationStore';

export default function PublicLayout() {
  const accessToken = authStore(state => state.accessToken);
  const isSignedIn = Boolean(accessToken);
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    if (!deferredNavigationStore.getState().claimPostLoginNavigation()) {
      return;
    }

    const targetRoute =
      deferredNavigationStore.getState().takeDeferredRoute();
    router.replace(targetRoute ?? '/home');
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
