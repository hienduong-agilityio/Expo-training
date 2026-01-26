import { memo, useMemo } from 'react';
import { ScrollView } from 'react-native';

// Types
import type { IProduct, IProductSize } from '@app/interfaces/product';

// Components
import { ProductImageCarousel } from '@app/components/ui/ProductImageCarousel';
import { ProductDetails } from '@app/components/ui/ProductDetails';
import { SizeSelector } from '@app/components/ui/SizeSelector';
import { ProductActions } from '@app/components/ui/ProductActions';
import { DeliveryInfo } from '@app/components/ui/DeliveryInfo';
import { SimilarProducts } from '@app/components/ui/SimilarProducts';

// Styles
import { styles } from './index.style';

// Mocks
import { MOCK_PRODUCTS } from '@app/mocks/products';

interface ProductDetailContentProps {
  product: IProduct;
  productImages: Array<{ uri: string } | number>;
  productSizes: IProductSize[];
  selectedSize: string;
  onSizeSelect: (sizeId: string) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onShowMoreDetails: () => void;
  onViewSimilar: () => void;
  onAddToCompare: () => void;
  onSimilarProductPress: (productId: string) => void;
}

const EMPTY_FEATURES: never[] = [];
const DELIVERY_TIME = '1 within Hour';

export const ProductDetailContent = memo(function ProductDetailContent({
  product,
  productImages,
  productSizes,
  selectedSize,
  onSizeSelect,
  onAddToCart,
  onBuyNow,
  onShowMoreDetails,
  onViewSimilar,
  onAddToCompare,
  onSimilarProductPress,
}: ProductDetailContentProps) {
  const productDetailsProps = useMemo(
    () => ({
      ...product,
      details: product.description || '',
      sizes: productSizes,
      features: EMPTY_FEATURES,
      onShowMoreDetails,
    }),
    [product, productSizes, onShowMoreDetails],
  );

  const similarProducts = MOCK_PRODUCTS as unknown as IProduct[];

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      <ProductImageCarousel images={productImages} productName={product.name} />

      <ProductDetails {...productDetailsProps} />

      {productSizes.length > 0 && (
        <SizeSelector
          sizes={productSizes}
          selectedSize={selectedSize}
          onSizeSelect={onSizeSelect}
        />
      )}

      <ProductActions onAddToCart={onAddToCart} onBuyNow={onBuyNow} />

      <DeliveryInfo deliveryTime={DELIVERY_TIME} />

      <SimilarProducts
        products={similarProducts}
        onViewSimilar={onViewSimilar}
        onAddToCompare={onAddToCompare}
        onProductPress={onSimilarProductPress}
      />
    </ScrollView>
  );
});
