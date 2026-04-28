import { useCallback } from 'react';
import { Alert } from 'react-native';

// Constants
import { PRODUCT_MESSAGES } from '@app/constants';

// Types
import type { IProduct } from '@app/interfaces/product';

/**
 * Hook managing alerts (Alert/Modal) related to products.
 */
export const useProductAlerts = () => {
  const showDetails = useCallback((product: IProduct) => {
    Alert.alert(
      PRODUCT_MESSAGES.PRODUCT_DETAILS,
      product.description || PRODUCT_MESSAGES.NO_DETAILS_AVAILABLE,
    );
  }, []);

  const showSimilar = useCallback(() => {
    Alert.alert(
      PRODUCT_MESSAGES.VIEW_SIMILAR,
      PRODUCT_MESSAGES.VIEW_SIMILAR_DESCRIPTION,
    );
  }, []);

  const showCompare = useCallback(() => {
    Alert.alert(
      PRODUCT_MESSAGES.ADD_TO_COMPARE,
      PRODUCT_MESSAGES.ADD_TO_COMPARE_DESCRIPTION,
    );
  }, []);

  return { showDetails, showSimilar, showCompare };
};
