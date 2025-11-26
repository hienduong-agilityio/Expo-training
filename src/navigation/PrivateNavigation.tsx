import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

// Screens
import { HomeScreen } from '@app/screens/HomeScreen';
import { WishlistScreen } from '@app/screens/WishlistScreen';
import { CartScreen } from '@app/screens/CartScreen';
import { SearchScreen } from '@app/screens/SearchScreen';
import { SettingsScreen } from '@app/screens/SettingsScreen';
import { ProductListScreen } from '@app/screens/ProductListScreen';
import { ProductDetailScreen } from '@app/screens/ProductDetailsScreen';
import { CheckoutScreen } from '@app/screens/CheckoutScreen';

// Types
import type {
  PrivateStackParamList,
  PrivateTabParamList,
} from '@app/interfaces/navigation';

// Constants
import {
  PRIVATE_SCREENS,
  PRODUCT_LIST_TITLES,
  SCREEN_OPTIONS,
} from '@app/constants';

// Icons
import { TAB_ICONS } from '@app/icons/TabIcons';

// Components
import { ProductDetailHeaderRight } from '@app/components/ui/ProductDetailHeader';

// Styles
import { defaultNavOptions } from '@app/components/ui/ProductDetailHeader/index.style';

const Tab = createBottomTabNavigator<PrivateTabParamList>();
const Stack = createNativeStackNavigator<PrivateStackParamList>();

const getProductDetailHeaderRight =
  (
    productId: string,
    navigation: NativeStackNavigationProp<PrivateStackParamList>,
  ) =>
  () => (
    <ProductDetailHeaderRight productId={productId} navigation={navigation} />
  );

const PrivateTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName={PRIVATE_SCREENS.HOME}
      screenOptions={SCREEN_OPTIONS}>
      <Tab.Screen
        name={PRIVATE_SCREENS.HOME}
        component={HomeScreen}
        options={{
          title: PRIVATE_SCREENS.HOME,
          tabBarIcon: TAB_ICONS.HOME,
        }}
      />
      <Tab.Screen
        name={PRIVATE_SCREENS.WISHLIST}
        component={WishlistScreen}
        options={{
          title: PRIVATE_SCREENS.WISHLIST,
          tabBarIcon: TAB_ICONS.WISHLIST,
        }}
      />
      <Tab.Screen
        name={PRIVATE_SCREENS.CART}
        component={CartScreen}
        options={{
          title: PRIVATE_SCREENS.CART,
          tabBarIcon: TAB_ICONS.CART,
        }}
      />
      <Tab.Screen
        name={PRIVATE_SCREENS.SEARCH}
        component={SearchScreen}
        options={{
          title: PRIVATE_SCREENS.SEARCH,
          tabBarIcon: TAB_ICONS.SEARCH,
        }}
      />
      <Tab.Screen
        name={PRIVATE_SCREENS.SETTINGS}
        component={SettingsScreen}
        options={{
          title: PRIVATE_SCREENS.SETTINGS,
          tabBarIcon: TAB_ICONS.SETTINGS,
        }}
      />
    </Tab.Navigator>
  );
};

export const PrivateStackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={PRIVATE_SCREENS.HOME}
        component={PrivateTabNavigation}
      />

      <Stack.Screen
        name={PRIVATE_SCREENS.PRODUCT_LIST}
        component={ProductListScreen}
        options={({ route }) => ({
          headerShown: true,
          title: PRODUCT_LIST_TITLES[route.params.type],
        })}
      />
      <Stack.Screen
        name={PRIVATE_SCREENS.PRODUCT_DETAIL}
        component={ProductDetailScreen}
        options={({ route, navigation }) => ({
          title: defaultNavOptions.title,
          headerRight: getProductDetailHeaderRight(
            route.params.productId,
            navigation,
          ),
          headerShown: true,
          headerStyle: defaultNavOptions.headerStyle,
        })}
      />
      <Stack.Screen
        name={PRIVATE_SCREENS.CHECKOUT}
        component={CheckoutScreen}
        options={{
          headerShown: true,
          title: PRIVATE_SCREENS.CHECKOUT,
        }}
      />
    </Stack.Navigator>
  );
};
