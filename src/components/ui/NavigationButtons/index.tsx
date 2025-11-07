// Icons
import { LeftArrowIcon, RightArrowIcon } from '@app/icons';

// Styles
import { styles } from './index.style';

// Themes
import { colors } from '@app/themes';

// Components
import { Button } from '@app/components/common/Button';

export interface INavigationButtonsProps {
  show?: boolean;
  disabledLeft?: boolean;
  disabledRight?: boolean;
  onLeft?: () => void;
  onRight?: () => void;
}

export const NavigationButtons = ({
  show,
  disabledLeft,
  disabledRight,
  onLeft,
  onRight,
}: INavigationButtonsProps) => {
  if (!show) return null;

  const leftColor = disabledLeft ? colors.textMuted : colors.text;
  const rightColor = disabledRight ? colors.textMuted : colors.text;

  return (
    <>
      <Button
        style={[styles.button, styles.left, disabledLeft && styles.disabled]}
        onPress={onLeft}
        disabled={disabledLeft}
        accessibilityRole="button"
        accessibilityLabel="Scroll left">
        <LeftArrowIcon size={20} color={leftColor} />
      </Button>

      <Button
        style={[styles.button, styles.right, disabledRight && styles.disabled]}
        onPress={onRight}
        disabled={disabledRight}
        accessibilityRole="button"
        accessibilityLabel="Scroll right">
        <RightArrowIcon size={20} color={rightColor} />
      </Button>
    </>
  );
};
