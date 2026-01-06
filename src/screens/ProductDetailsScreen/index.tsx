import { useMemo } from 'react';
import { View } from 'react-native';

// Types
import type { PrivateStackScreenProps } from '@app/interfaces/navigation';
import type { IProductSize } from '@app/interfaces/product';

// Constants
import { PRIVATE_SCREENS, PRODUCT_MESSAGES } from '@app/constants';

// Hooks
import { useProductById } from '@app/hooks/useProduct';
import { useProductSizeSelection } from '@app/hooks/useProductSizeSelection';
import { useProductCart } from '@app/hooks/useProductCart';
import { useProductAlerts } from '@app/hooks/useProductAlerts';
import { useAppNavigation } from '@app/hooks/useAppNavigation';

// Components
import { LoadingState } from '@app/components/ui/LoadingState';
import { NotFound } from '@app/components/ui/NotFound';
import { ProductDetailContent } from './ProductDetailContent';

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

export const ProductDetailScreen = ({ route }: ProductDetailScreenProps) => {
  const productId = route.params?.productId;

  // 1. Data Fetching
  const { product, isLoading } = useProductById(productId);

  // 2. Domain Hooks (Split chuẩn, dễ tái sử dụng)
  const { handleGoBack, navigateToDetail } = useAppNavigation();
  const { handleAddToCart, handleBuyNow } = useProductCart();
  const { showDetails, showSimilar, showCompare } = useProductAlerts();

  // 3. Local Logic & Memoization
  const productSizes = useMemo(() => (product ? MOCK_SIZES : []), [product]);
  const { selectedSize, handleSizeSelect } = useProductSizeSelection(
    productId,
    productSizes,
  );

  // 4. UI Rendering
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
        productImages={product?.imageSource ? [product.imageSource] : []}
        productSizes={productSizes}
        selectedSize={selectedSize}
        onSizeSelect={handleSizeSelect}
        onAddToCart={() => handleAddToCart(product, selectedSize)}
        onBuyNow={() => handleBuyNow(product)}
        onShowMoreDetails={() => showDetails(product)}
        onViewSimilar={showSimilar}
        onAddToCompare={showCompare}
        onSimilarProductPress={navigateToDetail}
      />
    </View>
  );
};
