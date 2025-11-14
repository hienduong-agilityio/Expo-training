import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import { GlobalHeader } from '@app/components/GlobalHeader';

// Screens
import { HomeScreen } from '@app/screens/HomeScreen';
import { WishlistScreen } from '@app/screens/WishlistScreen';
import { CartScreen } from '@app/screens/CartScreen';
import { SearchScreen } from '@app/screens/SearchScreen';
import { SettingsScreen } from '@app/screens/SettingsScreen';

// Constants
import { PRIVATE_SCREENS } from '@app/constants';

// Types
import type { PrivateStackParamList } from '@app/interfaces';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<PrivateStackParamList>();

const MainHeader = ({ navigation }: NativeStackHeaderProps) => {
  const showMenu = true;
  const showProfile = true;

  return (
    <GlobalHeader
      showMenu={showMenu}
      showProfile={showProfile}
      onMenuPress={() => {}}
      onProfilePress={() => {
        if (!showProfile) return;
        navigation.navigate(PRIVATE_SCREENS.SETTINGS);
      }}
    />
  );
};

export const PrivateStackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={PRIVATE_SCREENS.HOME}
      screenOptions={{
        headerShown: true,
        header: MainHeader,
      }}>
      <Stack.Screen
        name={PRIVATE_SCREENS.HOME}
        component={HomeScreen}
        options={{ title: PRIVATE_SCREENS.HOME }}
      />
      <Stack.Screen
        name={PRIVATE_SCREENS.WISHLIST}
        component={WishlistScreen}
        options={{ title: PRIVATE_SCREENS.WISHLIST }}
      />
      <Stack.Screen
        name={PRIVATE_SCREENS.CART}
        component={CartScreen}
        options={{ title: PRIVATE_SCREENS.CART }}
      />

      <Stack.Screen
        name={PRIVATE_SCREENS.SEARCH}
        component={SearchScreen}
        options={{ title: PRIVATE_SCREENS.SEARCH }}
      />

      <Stack.Screen
        name={PRIVATE_SCREENS.SETTINGS}
        component={SettingsScreen}
        options={{ title: PRIVATE_SCREENS.SETTINGS }}
      />
    </Stack.Navigator>
  );
};
