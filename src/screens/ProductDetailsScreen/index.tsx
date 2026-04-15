import { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';

// Types
import type { IProductSize } from '@app/interfaces/product';

// Constants
import { PRODUCT_MESSAGES } from '@app/constants';

// Hooks
import { useProductById } from '@app/hooks/useProduct';
import { useProductSizeSelection } from '@app/hooks/useProductSizeSelection';
import { useProductCart } from '@app/hooks/useProductCart';
import { useProductAlerts } from '@app/hooks/useProductAlerts';
import { useAppNavigation } from '@app/hooks/useAppNavigation';

// Components
import { LoadingState } from '@app/components/ui/LoadingState';
import { NotFound } from '@app/components/ui/NotFound';
import { ProductDetailHeaderRight } from '@app/components/ui/ProductDetailHeader';
import { defaultNavOptions } from '@app/components/ui/ProductDetailHeader/index.style';
import { ProductDetailContent } from './ProductDetailContent';

// Styles
import { styles } from './index.style';

const paramStr = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const MOCK_SIZES: IProductSize[] = [
  { id: '1', size: '7 UK', available: true },
  { id: '2', size: '8 UK', available: true },
  { id: '3', size: '9 UK', available: true },
  { id: '4', size: '10 UK', available: false },
];

export const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const raw = useLocalSearchParams<{ productId: string | string[] }>();
  const productId = paramStr(raw.productId);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: defaultNavOptions.title,
      headerRight: () =>
        productId ? (
          <ProductDetailHeaderRight productId={productId} />
        ) : null,
      headerShown: true,
      headerStyle: defaultNavOptions.headerStyle,
    });
  }, [navigation, productId]);

  const { product, isLoading } = useProductById(productId);

  const { handleGoBack, navigateToDetail } = useAppNavigation();
  const { handleAddToCart, handleBuyNow } = useProductCart();
  const { showDetails, showSimilar, showCompare } = useProductAlerts();

  const productSizes = product ? MOCK_SIZES : [];
  const { selectedSize, handleSizeSelect } = useProductSizeSelection(
    productId,
    productSizes,
  );

  const productImages = product?.imageSource ? [product.imageSource] : [];

  const handleAddToCartPress = () => {
    if (product) {
      handleAddToCart(product, selectedSize);
    }
  };

  const handleBuyNowPress = () => {
    if (product) {
      handleBuyNow(product);
    }
  };

  const handleShowMoreDetails = () => {
    if (product) {
      showDetails(product);
    }
  };

  if (isLoading) {
    return <LoadingState message={PRODUCT_MESSAGES.LOADING_DETAILS} />;
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <NotFound
          title={PRODUCT_MESSAGES.NOT_FOUND}
          retryLabel={PRODUCT_MESSAGES.GO_BACK}
          onRetry={handleGoBack}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProductDetailContent
        product={product}
        productImages={productImages}
        productSizes={productSizes}
        selectedSize={selectedSize}
        onSizeSelect={handleSizeSelect}
        onAddToCart={handleAddToCartPress}
        onBuyNow={handleBuyNowPress}
        onShowMoreDetails={handleShowMoreDetails}
        onViewSimilar={showSimilar}
        onAddToCompare={showCompare}
        onSimilarProductPress={navigateToDetail}
      />
    </View>
  );
};
