import { useCallback } from 'react';

// React Navigation
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Constants
import { PRIVATE_SCREENS } from '@app/constants';

// Types
import { PrivateStackParamList } from '@app/interfaces/navigation';

export const useAppNavigation = () => {
  const navigation = useNavigation<NavigationProp<PrivateStackParamList>>();

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(PRIVATE_SCREENS.MAIN_TABS);
    }
  }, [navigation]);

  const navigateToDetail = useCallback(
    (productId: string) => {
      navigation.navigate(PRIVATE_SCREENS.PRODUCT_DETAIL, {
        productId,
      });
    },
    [navigation],
  );

  return {
    handleGoBack,
    navigateToDetail,
    navigation,
  };
};
