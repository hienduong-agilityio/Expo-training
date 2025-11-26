import { View, Text, TouchableOpacity } from 'react-native';

// Components
import { Price } from '@app/components/common/Price';

// Types
import type { IProductDetailsProps } from '@app/interfaces';

// Helpers
import { formatCurrencyUnit } from '@app/helpers';

// Styles
import { styles } from './index.style';

// Icons
import { StarsRating } from '@app/components/ui/StarsRating';

export const ProductDetails = ({
  name,
  price,
  originalPrice,
  currency = 'USD',
  shortDescription,
  discountPercent,
  rating,
  reviewCount,
  details,
  onShowMoreDetails,
}: IProductDetailsProps) => {
  return (
    <View style={styles.container}>
      {/* Product Name */}
      <Text style={styles.productName}>{name}</Text>

      {shortDescription && (
        <Text style={styles.subtitle}>{shortDescription}</Text>
      )}

      {/* Rating */}
      {rating !== undefined && (
        <View style={styles.ratingContainer}>
          <StarsRating rating={rating || 0} />
          {reviewCount !== undefined && (
            <Text style={styles.reviewCount}>
              {reviewCount.toLocaleString()}
            </Text>
          )}
        </View>
      )}

      {/* Price */}
      <View style={styles.priceContainer}>
        {originalPrice && originalPrice > price && (
          <Text style={styles.originalPriceText}>
            {formatCurrencyUnit(originalPrice, currency)}
          </Text>
        )}
        <View style={styles.currentPriceContainer}>
          <Price value={price} currency={currency} />
        </View>
        {discountPercent !== undefined && discountPercent > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercent}% Off</Text>
          </View>
        )}
      </View>

      {/* Product Details */}
      {details && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText} numberOfLines={4}>
            {details}
          </Text>
          <TouchableOpacity onPress={onShowMoreDetails}>
            <Text style={styles.moreText}>More</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
