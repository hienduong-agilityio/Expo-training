import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Types
import type { PrivateStackParamList } from '@app/interfaces/navigation';
import type { IProductSize } from '@app/interfaces/product';

// Constants
import {
  PRIVATE_SCREENS,
  POSITION,
  STATUS,
  TOAST_MESSAGES,
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

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  typeof PRIVATE_SCREENS.PRODUCT_DETAIL
>;

const MOCK_SIZES: IProductSize[] = [
  { id: '1', size: '7 UK', available: true },
  { id: '2', size: '8 UK', available: true },
  { id: '3', size: '9 UK', available: true },
  { id: '4', size: '10 UK', available: false },
];

export const ProductDetailScreen = ({ route, navigation }: Props) => {
  const { productId } = route.params;
  const [selectedSize, setSelectedSize] = useState<string>('');

  const { showToast } = toastStore();

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

    const parent = navigation.getParent();

    if (parent) {
      parent.navigate(PRIVATE_SCREENS.HOME);
    }
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

  const handleShowMoreDetails = () => {
    if (!product) return;

    Alert.alert(
      'Product Details',
      product.description || 'No details available',
    );
  };

  const handleViewSimilar = () => {
    Alert.alert('View Similar', 'Showing similar products');
  };

  const handleAddToCompare = () => {
    Alert.alert('Add to Compare', 'Product added to comparison');
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
          message="Loading product details..."
          containerStyle={styles.loadingContainer}
        />
      </View>
    );
  }

  if (!product && !queryError) {
    return (
      <View style={styles.container}>
        <NotFound
          title="Product Not Found"
          description="The product you're looking for doesn't exist or has been removed."
          retryLabel="Go Back"
          onRetry={handleGoBack}
        />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <NotFound
          title="Failed to Load Product"
          description="Unable to load product details. Please try again."
          retryLabel="Retry"
          onRetry={() => refetch()}
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
        onBuyNow={() => {
          showToast({
            type: STATUS.SUCCESS,
            message: `Proceeding to checkout for ${product.name} `,
            position: POSITION.TOP,
          });
        }}
        onShowMoreDetails={handleShowMoreDetails}
        onViewSimilar={handleViewSimilar}
        onAddToCompare={handleAddToCompare}
        onSimilarProductPress={handleSimilarProductPress}
      />
    </View>
  );
};
