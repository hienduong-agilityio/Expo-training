import type { LinkingOptions } from '@react-navigation/native';
import * as ExpoLinking from 'expo-linking';

// Constants
import { PRIVATE_SCREENS, PUBLIC_SCREENS } from '@app/constants';

// Types
import type {
  PrivateStackParamList,
  PublicStackParamList,
} from '@app/interfaces/navigation';

type RootStackParamList = PrivateStackParamList & PublicStackParamList;

const schemePrefixes = ExpoLinking.collectManifestSchemes().map(
  scheme => `${scheme}://`,
);
const prefixes = [...new Set([ExpoLinking.createURL('/'), ...schemePrefixes])];

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes,
  config: {
    screens: {
      // Public
      [PUBLIC_SCREENS.ONBOARDING]: 'onboarding',
      [PUBLIC_SCREENS.LOGIN]: 'login',
      [PUBLIC_SCREENS.REGISTER]: 'register',

      [PRIVATE_SCREENS.MAIN_TABS]: {
        screens: {
          [PRIVATE_SCREENS.HOME]: 'home',
          [PRIVATE_SCREENS.WISHLIST]: 'wishlist',
          [PRIVATE_SCREENS.CART]: 'cart',
          [PRIVATE_SCREENS.SEARCH]: 'search',
          [PRIVATE_SCREENS.SETTINGS]: 'settings',
        },
      },

      // Stacks
      [PRIVATE_SCREENS.PRODUCT_LIST]: 'products/:type',
      [PRIVATE_SCREENS.PRODUCT_DETAIL]: 'product/:productId',
      [PRIVATE_SCREENS.CHECKOUT]: 'checkout',
    },
  },
};
