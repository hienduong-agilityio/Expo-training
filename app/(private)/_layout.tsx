import { Redirect, Stack } from 'expo-router';

import { authStore } from '@app/stores/authStore';

export default function PrivateLayout() {
  const accessToken = authStore(state => state.accessToken);
  const isAuth = Boolean(accessToken);

  if (!isAuth) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
