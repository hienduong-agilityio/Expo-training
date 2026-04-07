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
