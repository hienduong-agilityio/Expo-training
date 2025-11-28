import { useCallback, useMemo } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

// Types
import type { PrivateStackScreenProps } from '@app/interfaces/navigation';

// Constants
import { PRIVATE_SCREENS } from '@app/constants';

// Hooks
import { useCategorizedProducts } from '@app/hooks/useProduct';

// Helpers
import { getProductsByListType } from '@app/helpers/products';

// Components
import { GridProductList } from '@app/components/ui/ProductList';

// Styles
import { styles } from './index.style';

type ProductListScreenProps = PrivateStackScreenProps<
  typeof PRIVATE_SCREENS.PRODUCT_LIST
>;

export const ProductListScreen = ({
  route,
  navigation,
}: ProductListScreenProps) => {
  const productListType = route.params?.type;

  const {
    data: categorizedData,
    isLoading,
    isFetching,
    error,
  } = useCategorizedProducts();

  const loading = isLoading || isFetching;

  const products = useMemo(
    () => getProductsByListType(productListType, categorizedData),
    [productListType, categorizedData],
  );

  const handleItemPress = useCallback(
    (id: string) => {
      navigation.navigate(PRIVATE_SCREENS.PRODUCT_DETAIL, { productId: id });
    },
    [navigation],
  );

  if (loading && !categorizedData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error && !categorizedData) {
    return (
      <View style={styles.center}>
        <Text>Something went wrong. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GridProductList
        products={products}
        onItemPress={handleItemPress}
        numColumns={2}
      />
    </View>
  );
};
