import { PRIVATE_SCREENS, PUBLIC_SCREENS } from '@app/constants';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type PrivateStackParamList = {
  [PRIVATE_SCREENS.HOME]: undefined;
  [PRIVATE_SCREENS.WISHLIST]: undefined;
  [PRIVATE_SCREENS.CART]: undefined;
  [PRIVATE_SCREENS.SEARCH]: undefined;
  [PRIVATE_SCREENS.SETTINGS]: undefined;
};

export type PublicStackParamList = {
  [PUBLIC_SCREENS.ONBOARDING]: undefined;
  [PUBLIC_SCREENS.LOGIN]: undefined;
  [PUBLIC_SCREENS.REGISTER]: undefined;
};

export type PrivateStackScreenProps<
  Screen extends keyof PrivateStackParamList,
> = NativeStackScreenProps<PrivateStackParamList, Screen>;

export type PublicStackScreenProps<Screen extends keyof PublicStackParamList> =
  NativeStackScreenProps<PublicStackParamList, Screen>;
