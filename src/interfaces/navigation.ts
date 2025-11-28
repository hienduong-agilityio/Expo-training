// Constants
import {
  PRIVATE_SCREENS,
  PUBLIC_SCREENS,
  ProductListType,
} from '@app/constants';

// Types
import type {
  NavigatorScreenParams,
  RouteProp,
} from '@react-navigation/native';
import type {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type PrivateTabParamList = {
  [PRIVATE_SCREENS.HOME]: undefined;
  [PRIVATE_SCREENS.WISHLIST]: undefined;
  [PRIVATE_SCREENS.CART]: undefined;
  [PRIVATE_SCREENS.SEARCH]: undefined;
  [PRIVATE_SCREENS.SETTINGS]: undefined;
};

export type PrivateStackParamList = {
  [PRIVATE_SCREENS.HOME]:
    | NavigatorScreenParams<PrivateTabParamList>
    | undefined;
  [PRIVATE_SCREENS.PRODUCT_LIST]: {
    type: ProductListType;
    title: string;
  };
  [PRIVATE_SCREENS.PRODUCT_DETAIL]: {
    productId: string;
  };
  [PRIVATE_SCREENS.CHECKOUT]: undefined;
};

export type PublicStackParamList = {
  [PUBLIC_SCREENS.ONBOARDING]: undefined;
  [PUBLIC_SCREENS.LOGIN]: undefined;
  [PUBLIC_SCREENS.REGISTER]: undefined;
};

export type PrivateStackScreenProps<
  Screen extends keyof PrivateStackParamList,
> = NativeStackScreenProps<PrivateStackParamList, Screen>;

export type PrivateTabScreenProps<Screen extends keyof PrivateTabParamList> = {
  navigation: AppNavigationProp;
  route: RouteProp<PrivateTabParamList, Screen>;
};

export type AppNavigationProp =
  NativeStackNavigationProp<PrivateStackParamList> &
    BottomTabNavigationProp<PrivateTabParamList>;

export type PublicStackScreenProps<Screen extends keyof PublicStackParamList> =
  NativeStackScreenProps<PublicStackParamList, Screen>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends PrivateStackParamList {}
  }
}
