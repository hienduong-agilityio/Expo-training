import { useCallback, useMemo } from 'react';

// Components
import { View, Text, Pressable } from 'react-native';
import { FallbackImage } from '@app/components/common/FallbackImage';
import { Price } from '@app/components/common/Price';
import { StarsRating } from '@app/components/ui/StarsRating';

// Icons
import { HeartIcon } from '@app/icons';

// Types
import type { IProductCardProps } from '@app/interfaces';

// Themes
import { colors } from '@app/themes';

// Styles
import { styles } from './index.style';

export const ProductCard = ({
  id,
  name,
  description,
  brand,
  price,
  currency = 'INR',
  rating = 0,
  reviewCount,
  imageSource,
  style,
  onPress,
  onWishlistToggle,
  isWishlisted = false,
}: IProductCardProps) => {
  // Handle press event
  const handlePress = useCallback(() => {
    onPress?.(id);
  }, [onPress, id]);

  // Handle wishlist toggle event
  const handleWishlistToggle = useCallback(() => {
    onWishlistToggle?.(id);
  }, [onWishlistToggle, id]);

  // Memoize computed values
  const displayDescription = useMemo(() => {
    return description || `${brand || ''} ${name}`.trim();
  }, [description, brand, name]);

  const accessibilityLabel = useMemo(() => {
    return `Product: ${name}, Price: ${price} ${currency}, Rating: ${rating} stars`;
  }, [name, price, currency, rating]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        style,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <FallbackImage
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`${name} product image`}
        />

        {onWishlistToggle && (
          <Pressable
            style={({ pressed }) => [
              styles.wishlistButton,
              pressed && styles.wishlistPressed,
            ]}
            onPress={handleWishlistToggle}
            accessibilityRole="button">
            <HeartIcon
              width={20}
              height={20}
              color={isWishlisted ? colors.primary : colors.text}
              filled={isWishlisted}
            />
          </Pressable>
        )}
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        {/* Product Name */}
        <Text
          style={styles.productName}
          numberOfLines={1}
          accessibilityLabel={`Product name: ${name}`}>
          {name}
        </Text>

        {/* Brand/Description */}
        <Text
          style={styles.description}
          numberOfLines={2}
          accessibilityLabel={`Description: ${displayDescription}`}>
          {displayDescription}
        </Text>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Price value={price} currency={currency} />
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <StarsRating rating={rating} />
          {reviewCount && (
            <Text
              style={styles.reviewCount}
              accessibilityLabel={`${reviewCount.toLocaleString()} reviews`}>
              {reviewCount.toLocaleString()}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};
