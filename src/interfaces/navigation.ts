import { SCREENS } from '@app/constants';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AppStackParamList = {
  [SCREENS.LOGIN]: undefined;
  [SCREENS.REGISTER]: undefined;
  [SCREENS.HOME]: undefined;
  [SCREENS.WISHLIST]: undefined;
  [SCREENS.CART]: undefined;
  [SCREENS.SEARCH]: undefined;
  [SCREENS.SETTINGS]: undefined;
};

// AppStack
export type AppStackScreenProps<Screen extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, Screen>;
