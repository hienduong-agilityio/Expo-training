import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components
import { GlobalHeader } from '@app/components/GlobalHeader/index';

// Screens
import { HomeScreen } from '@app/screens/HomeScreen';
import { WishlistScreen } from '@app/screens/WishlistScreen';
import { CartScreen } from '@app/screens/CartScreen';
import { SearchScreen } from '@app/screens/SearchScreen';
import { SettingsScreen } from '@app/screens/SettingsScreen';

// Constants
import { SCREENS } from '@app/constants';

// Types
import type { AppStackParamList } from '@app/interfaces';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<AppStackParamList>();

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

        navigation.navigate(SCREENS.SETTINGS);
      }}
    />
  );
};

export const AppStackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: MainHeader,
      }}>
      <Stack.Screen
        name={SCREENS.HOME}
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />

      <Stack.Screen
        name={SCREENS.WISHLIST}
        component={WishlistScreen}
        options={{
          title: 'Wishlist',
        }}
      />

      <Stack.Screen
        name={SCREENS.CART}
        component={CartScreen}
        options={{
          title: 'Cart',
        }}
      />

      <Stack.Screen
        name={SCREENS.SEARCH}
        component={SearchScreen}
        options={{
          title: 'Search',
        }}
      />

      <Stack.Screen
        name={SCREENS.SETTINGS}
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
};
