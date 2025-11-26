import {
  PRIVATE_SCREENS,
  PUBLIC_SCREENS,
  ProductListType,
} from '@app/constants';
import { NavigatorScreenParams } from '@react-navigation/native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type PrivateTabParamList = {
  [PRIVATE_SCREENS.HOME]: undefined;
  [PRIVATE_SCREENS.WISHLIST]: undefined;
  [PRIVATE_SCREENS.CART]: undefined;
  [PRIVATE_SCREENS.SEARCH]: undefined;
  [PRIVATE_SCREENS.SETTINGS]: undefined;
};

export type PrivateStackParamList = {
  [PRIVATE_SCREENS.HOME]: NavigatorScreenParams<PrivateTabParamList>;
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

export type PrivateStackScreenProps<Screen extends keyof PrivateTabParamList> =
  NativeStackScreenProps<PrivateTabParamList, Screen>;

export type PublicStackScreenProps<Screen extends keyof PublicStackParamList> =
  NativeStackScreenProps<PublicStackParamList, Screen>;
