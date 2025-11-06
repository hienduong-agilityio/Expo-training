import { View, Text, TouchableOpacity } from 'react-native';

// Components
import { Price } from '@app/components/common/Price';

// Types
import type { IProductDetailsProps } from '@app/interfaces';
import type { CurrencyCode } from '@app/helpers';

// Styles
import { styles } from './index.style';

// Icons
import { StarsRating } from '@app/components/ui/StarsRating';

export const ProductDetails = ({
  name,
  description,
  price,
  originalPrice,
  discountPercent,
  currency = 'INR',
  rating,
  reviewCount,
  details,
  onShowMoreDetails,
}: IProductDetailsProps) => {
  const currencyCode = (currency || 'INR') as CurrencyCode;

  return (
    <View style={styles.container}>
      {/* Product Name */}
      <Text style={styles.productName}>{name}</Text>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <StarsRating rating={rating} />
        <Text style={styles.reviewCount}>{reviewCount.toLocaleString()}</Text>
      </View>

      {/* Price */}
      <View style={styles.priceContainer}>
        {originalPrice && originalPrice > price && (
          <View style={styles.originalPrice}>
            <Price value={originalPrice} currency={currencyCode} />
          </View>
        )}
        <View style={styles.currentPrice}>
          <Price value={price} currency={currencyCode} />
        </View>
        {discountPercent && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercent}% Off</Text>
          </View>
        )}
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Product Details</Text>
        <Text style={styles.detailsText} numberOfLines={4}>
          {details}
        </Text>
        <TouchableOpacity onPress={onShowMoreDetails}>
          <Text style={styles.moreText}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
