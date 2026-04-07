import { View } from 'react-native';

// Styles
import { styles } from './index.style';

export interface IPaginationDotsProps {
  currentIndex: number;
  totalCount: number;
}

export const PaginationDots = ({
  currentIndex,
  totalCount,
}: IPaginationDotsProps) => {
  return (
    <View
      style={styles.dotsContainer}
      accessibilityRole="checkbox"
      accessibilityLabel="Pagination dots">
      {Array.from({ length: totalCount }, (_, index) => index).map(index => (
        <View
          key={`dot-${index}`}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};
