import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';

// Types
import type { PrivateStackScreenProps } from '@app/interfaces/navigation';
import type { IProductSize } from '@app/interfaces/product';

// Constants
import {
  PRIVATE_SCREENS,
  POSITION,
  STATUS,
  TOAST_MESSAGES,
  PRODUCT_MESSAGES,
  MESSAGES,
} from '@app/constants';

// Hooks
import { useProductById } from '@app/hooks/useProduct';
import { useCart } from '@app/hooks/useCart';

// Stores
import { toastStore } from '@app/stores/toastStore';

// Components
import { LoadingState } from '@app/components/ui/LoadingState';
import { NotFound } from '@app/components/ui/NotFound';
import { ProductDetailContent } from './ProductDetailContent';

// Helpers
import { getApiErrorMessage } from '@app/helpers/errorMessage';

// Styles
import { styles } from './index.style';

type ProductDetailScreenProps = PrivateStackScreenProps<
  typeof PRIVATE_SCREENS.PRODUCT_DETAIL
>;

const MOCK_SIZES: IProductSize[] = [
  { id: '1', size: '7 UK', available: true },
  { id: '2', size: '8 UK', available: true },
  { id: '3', size: '9 UK', available: true },
  { id: '4', size: '10 UK', available: false },
];

export const ProductDetailScreen = ({
  route,
  navigation,
}: ProductDetailScreenProps) => {
  const productId = route.params?.productId;

  const [selectedSize, setSelectedSize] = useState<string>('');

  const showToast = toastStore(state => state.showToast);

  const {
    product,
    isLoading,
    error: queryError,
    refetch,
  } = useProductById(productId);

  const { addItem } = useCart();

  const productImages = useMemo(() => {
    if (!product?.imageSource) return [];

    return [product.imageSource];
  }, [product?.imageSource]);

  const productSizes: IProductSize[] = useMemo(() => {
    if (!product) return [];

    return MOCK_SIZES;
  }, [product]);

  useEffect(() => {
    if (productSizes.length === 0 || selectedSize) return;

    const firstAvailable = productSizes.find(size => size.available);
    if (firstAvailable) {
      setSelectedSize(firstAvailable.size);
    }
  }, [productSizes, selectedSize]);

  const handleSizeSelect = useCallback((sizeId: string) => {
    setSelectedSize(sizeId);
  }, []);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate(PRIVATE_SCREENS.HOME);
  };

  const handleAddToCart = useCallback(async () => {
    try {
      await addItem({
        productId: product?.id ?? '',
        quantity: 1,
      });

      showToast({
        type: STATUS.SUCCESS,
        message: `${product?.name} (${selectedSize}) added to cart`,
      });
    } catch (error) {
      showToast({
        type: STATUS.ERROR,
        message: getApiErrorMessage(error, TOAST_MESSAGES.ADD_TO_CART_FAILED),
      });
    }
  }, [product, selectedSize, addItem, showToast]);

  const handleBuyNow = useCallback(() => {
    showToast({
      type: STATUS.SUCCESS,
      message: `${MESSAGES.OR_CONTINUE_WITH} ${product?.name}`,
      position: POSITION.TOP,
    });
  }, [product, showToast]);

  const handleShowMoreDetails = () => {
    if (!product) return;

    Alert.alert(
      PRODUCT_MESSAGES.PRODUCT_DETAILS,
      product.description || PRODUCT_MESSAGES.NO_DETAILS_AVAILABLE,
    );
  };

  const handleViewSimilar = () => {
    Alert.alert(
      PRODUCT_MESSAGES.VIEW_SIMILAR,
      PRODUCT_MESSAGES.VIEW_SIMILAR_DESCRIPTION,
    );
  };

  const handleAddToCompare = () => {
    Alert.alert(
      PRODUCT_MESSAGES.ADD_TO_COMPARE,
      PRODUCT_MESSAGES.ADD_TO_COMPARE_DESCRIPTION,
    );
  };

  const handleSimilarProductPress = (similarProductId: string) => {
    navigation.navigate(PRIVATE_SCREENS.PRODUCT_DETAIL, {
      productId: similarProductId,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingState
          message={PRODUCT_MESSAGES.LOADING_DETAILS}
          containerStyle={styles.loadingContainer}
        />
      </View>
    );
  }

  if (!product && !queryError) {
    return (
      <View style={styles.container}>
        <NotFound
          title={PRODUCT_MESSAGES.NOT_FOUND}
          description={PRODUCT_MESSAGES.NOT_FOUND_DESCRIPTION}
          retryLabel={PRODUCT_MESSAGES.GO_BACK}
          onRetry={handleGoBack}
        />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <NotFound
          title={PRODUCT_MESSAGES.FAILED_TO_LOAD}
          description={PRODUCT_MESSAGES.FAILED_TO_LOAD_DESCRIPTION}
          retryLabel={PRODUCT_MESSAGES.RETRY}
          onRetry={() => {
            refetch();
          }}
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
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onShowMoreDetails={handleShowMoreDetails}
        onViewSimilar={handleViewSimilar}
        onAddToCompare={handleAddToCompare}
        onSimilarProductPress={handleSimilarProductPress}
      />
    </View>
  );
};
