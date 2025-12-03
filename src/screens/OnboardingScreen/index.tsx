import { useCallback, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Components
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from 'react-native';
import { OnboardingSlide } from '@app/components/ui/OnboardingSlide';
import { PaginationDots } from '@app/components/ui/PaginationDots';
import { OnboardingNavigation } from '@app/components/ui/OnboardingNavigation';

// Constants
import { HIT_SLOP, PUBLIC_SCREENS, BUTTON_LABELS } from '@app/constants';

// Mocks
import { ONBOARDING_DATA } from '@app/mocks/onboarding';

// Types
import type { IOnboardingItem, PublicStackScreenProps } from '@app/interfaces';

// Styles
import { styles } from './index.style';

type OnboardingScreenProps = PublicStackScreenProps<
  typeof PUBLIC_SCREENS.ONBOARDING
>;

export const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<IOnboardingItem>>(null);

  const totalCount = ONBOARDING_DATA.length;

  // Handle Scroll to end bottom of the onboarding slides
  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement } = event.nativeEvent;
      const index = Math.round(contentOffset.x / layoutMeasurement.width);

      setCurrentIndex(index);
    },
    [],
  );

  // Scroll to onboarding slide by index
  const scrollToIndex = useCallback((index: number) => {
    if (!flatListRef.current) return;

    flatListRef.current.scrollToIndex({
      index,
      animated: true,
    });

    setCurrentIndex(index);
  }, []);

  // Handle complete onboarding
  const handleCompleteOnboarding = useCallback(async () => {
    await AsyncStorage.setItem('HAS_SEEN_ONBOARDING', 'true');

    navigation.reset({
      index: 0,
      routes: [{ name: PUBLIC_SCREENS.LOGIN }],
    });
  }, [navigation]);

  // Handle next onboarding slide
  const handleNextSlide = useCallback(() => {
    const isLastSlide = currentIndex === totalCount - 1;

    isLastSlide ? handleCompleteOnboarding() : scrollToIndex(currentIndex + 1);
  }, [currentIndex, totalCount, handleCompleteOnboarding, scrollToIndex]);

  // Handle previous onboarding slide
  const handlePrevSlide = useCallback(() => {
    scrollToIndex(currentIndex - 1);
  }, [currentIndex, scrollToIndex]);

  // Handle skip onboarding
  const handleSkipOnboarding = useCallback(() => {
    handleCompleteOnboarding();
  }, [handleCompleteOnboarding]);

  const renderOnboardingSlide: ListRenderItem<IOnboardingItem> = ({ item }) => (
    <OnboardingSlide item={item} />
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleSkipOnboarding}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding">
            <Text style={styles.skipText}>{BUTTON_LABELS.SKIP}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={ONBOARDING_DATA}
          keyExtractor={item => item.id}
          renderItem={renderOnboardingSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          bounces={false}
        />

        <View style={styles.footer}>
          <PaginationDots currentIndex={currentIndex} totalCount={totalCount} />
          <OnboardingNavigation
            currentIndex={currentIndex}
            totalCount={totalCount}
            onPrev={handlePrevSlide}
            onNext={handleNextSlide}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
