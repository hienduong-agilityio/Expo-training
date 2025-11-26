import { useCallback, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { PrivateStackParamList } from '@app/interfaces/navigation';
import { PRIVATE_SCREENS } from '@app/constants';

import { useCategorizedProducts } from '@app/hooks/useProduct';
import { getProductsByListType } from '@app/helpers/products';
import { GridProductList } from '@app/components/ui/ProductList';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  typeof PRIVATE_SCREENS.PRODUCT_LIST
>;

export const ProductListScreen = ({ route, navigation }: Props) => {
  const { type } = route.params;

  const {
    data: categorizedData,
    isLoading,
    isFetching,
    error,
  } = useCategorizedProducts();

  const loading = isLoading || isFetching;

  const products = useMemo(
    () => getProductsByListType(type, categorizedData),
    [type, categorizedData],
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
