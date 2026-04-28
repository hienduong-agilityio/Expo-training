import { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

// Components
import { FallbackImage } from '@app/components/common/FallbackImage';
import { PaginationDots } from '@app/components/ui/PaginationDots';
import { NavigationButtons } from '@app/components/ui/NavigationButtons';

// Styles
import { styles } from './index.style';

interface IProductImageCarouselProps {
  images?: Array<{ uri: string } | number>;
  productName?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH;

export const ProductImageCarousel = ({
  images = [],
  productName = '',
}: IProductImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  if (!images || images.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <FallbackImage
            source={undefined}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={`${productName} image`}
          />
        </View>
      </View>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / IMAGE_WIDTH);
    setActiveIndex(index);
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      const prevIndex = activeIndex - 1;
      scrollViewRef.current?.scrollTo({
        x: prevIndex * IMAGE_WIDTH,
        animated: true,
      });
      setActiveIndex(prevIndex);
    }
  };

  const handleNext = () => {
    if (images.length > 0 && activeIndex < images.length - 1) {
      const nextIndex = activeIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * IMAGE_WIDTH,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }
  };

  const showNavigation = images.length > 1;
  const disabledLeft = activeIndex === 0;
  const disabledRight = activeIndex === images.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <FallbackImage
                source={image}
                style={styles.image}
                resizeMode="cover"
                accessibilityLabel={`${productName} image ${index + 1}`}
              />
            </View>
          ))}
        </ScrollView>

        <NavigationButtons
          show={showNavigation}
          disabledLeft={disabledLeft}
          disabledRight={disabledRight}
          onLeft={handlePrevious}
          onRight={handleNext}
        />
      </View>

      {images.length > 1 && (
        <View style={styles.pagination}>
          <PaginationDots
            currentIndex={activeIndex}
            totalCount={images.length}
          />
        </View>
      )}
    </View>
  );
};
