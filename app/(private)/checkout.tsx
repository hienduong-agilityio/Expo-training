import { Stack } from 'expo-router';

import { CheckoutScreen } from '@app/screens/CheckoutScreen';
import { PRIVATE_SCREENS } from '@app/constants';

export default function CheckoutRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: PRIVATE_SCREENS.CHECKOUT,
        }}
      />
      <CheckoutScreen />
    </>
  );
}
