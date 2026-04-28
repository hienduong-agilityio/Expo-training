import { View, Text } from 'react-native';

// Components
import { Button } from '@app/components/common/Button';

// Constants
import { HIT_SLOP } from '@app/constants';

// Styles
import { styles } from './index.style';

// Enums
import { BUTTON_COLORS, BUTTON_VARIANTS } from '@app/enums';

export interface IOnboardingNavigationProps {
  currentIndex: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
}

export const OnboardingNavigation = ({
  currentIndex,
  totalCount,
  onPrev,
  onNext,
}: IOnboardingNavigationProps) => {
  const isFirstPage = currentIndex === 0;
  const isLastPage = currentIndex === totalCount - 1;

  return (
    <View style={styles.navigationButtons}>
      <Button
        onPress={onPrev}
        variant={BUTTON_VARIANTS.GHOST}
        color={BUTTON_COLORS.PRIMARY}
        disabled={isFirstPage}
        hitSlop={HIT_SLOP}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Previous page"
        accessibilityState={{ disabled: isFirstPage }}>
        <Text
          style={[
            styles.buttonText,
            styles.prevButtonText,
            isFirstPage && styles.disabledButtonText,
          ]}>
          Prev
        </Text>
      </Button>
      <Button
        onPress={onNext}
        variant={BUTTON_VARIANTS.GHOST}
        color={BUTTON_COLORS.PRIMARY}
        hitSlop={HIT_SLOP}
        accessible
        accessibilityRole="button"
        accessibilityLabel={isLastPage ? 'Get started' : 'Next page'}>
        <Text style={[styles.buttonText, styles.nextButtonText]}>
          {isLastPage ? 'Get Started' : 'Next'}
        </Text>
      </Button>
    </View>
  );
};
