import { View, Text } from 'react-native';

// Styles
import { styles } from './index.style';

// Types
import type { IStarsRatingProps } from '@app/interfaces';

export const StarsRating = ({ rating, maxRating = 5 }: IStarsRatingProps) => {
  const safeRating = Math.max(0, Math.min(maxRating, Math.floor(rating)));

  return (
    <View style={styles.container} accessibilityRole="image">
      {Array.from({ length: maxRating }, (_, i) => i).map(starIndex => (
        <Text
          key={starIndex}
          style={[
            styles.star,
            starIndex < safeRating ? styles.starActive : styles.starInactive,
          ]}
          accessibilityRole="text">
          {starIndex < safeRating ? '★' : '☆'}
        </Text>
      ))}
    </View>
  );
};
