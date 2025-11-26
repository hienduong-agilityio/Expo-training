import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

// Components
import { BottomTabHeader } from '@app/components/BottomTabHeader';

// Config
import { colors } from '@app/themes/colors';

export const PUBLIC_SCREENS = {
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',
} as const;

export const PRIVATE_SCREENS = {
  HOME: 'Home',
  WISHLIST: 'Wishlist',
  CART: 'Cart',
  SEARCH: 'Search',
  SETTINGS: 'Settings',
  PRODUCT_LIST: 'ProductList',
  PRODUCT_DETAIL: 'ProductDetail',
  CHECKOUT: 'Checkout',
} as const;

export const SCREEN_OPTIONS: BottomTabNavigationOptions = {
  animation: 'shift',
  headerShown: true,
  header: BottomTabHeader,

  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarStyle: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 85,
    paddingBottom: 15,
    paddingTop: 10,
  },
  tabBarHideOnKeyboard: true,
  tabBarShowLabel: true,
} as const;
