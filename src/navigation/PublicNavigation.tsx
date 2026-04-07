import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { OnboardingScreen } from '@app/screens/OnboardingScreen';
import { LoginScreen } from '@app/screens/LoginScreen';
import { RegisterScreen } from '@app/screens/RegisterScreen';

// Constants
import { PUBLIC_SCREENS } from '@app/constants';

// Types
import type { PublicStackParamList } from '@app/interfaces';

const Stack = createNativeStackNavigator<PublicStackParamList>();

interface PublicStackNavigationProps {
  initialRouteName?: keyof PublicStackParamList;
}

export const PublicStackNavigation = ({
  initialRouteName = PUBLIC_SCREENS.ONBOARDING,
}: PublicStackNavigationProps) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={PUBLIC_SCREENS.ONBOARDING}
        component={OnboardingScreen}
        options={{ title: PUBLIC_SCREENS.ONBOARDING }}
      />
      <Stack.Screen
        name={PUBLIC_SCREENS.LOGIN}
        component={LoginScreen}
        options={{ title: PUBLIC_SCREENS.LOGIN }}
      />
      <Stack.Screen
        name={PUBLIC_SCREENS.REGISTER}
        component={RegisterScreen}
        options={{ title: PUBLIC_SCREENS.REGISTER }}
      />
    </Stack.Navigator>
  );
};
