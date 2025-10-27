import { SCREENS } from '@app/constants';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AppStackParamList = {
  [SCREENS.LOGIN]: undefined;
  [SCREENS.REGISTER]: undefined;
};

// AppStack
export type AppStackScreenProps<Screen extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, Screen>;
