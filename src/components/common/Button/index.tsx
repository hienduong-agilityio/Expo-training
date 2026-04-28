import { memo } from 'react';

// Components
import { Pressable, Text } from 'react-native';

// Themes
import { colors } from '@app/themes';

// Enums
import { BUTTON_VARIANTS } from '@app/enums';

// Helpers
import { getButtonStyles, getSizeMetrics } from '@app/helpers/ui';

// Styles
import { styles } from './index.style';

// Types
import type { IButtonProps } from '@app/interfaces';

export const Button = memo<IButtonProps>(function Button({
  label,
  children,
  variant = BUTTON_VARIANTS.SOLID,
  size = 'md',
  disabled,
  fullWidth,
  onPress,
  style: styleOverride,
  ...pressableProps
}) {
  const sizeMetrics = getSizeMetrics(size);
  const { containerStyle, labelStyle, isSolid } = getButtonStyles(variant);

  const content = children || (
    <Text style={[styles.label, labelStyle]} numberOfLines={1}>
      {label}
    </Text>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={state => [
        styles.base,
        {
          paddingHorizontal: sizeMetrics.paddingHorizontal,
        },
        containerStyle,
        state.pressed &&
          (isSolid
            ? { backgroundColor: colors.primaryDark }
            : { backgroundColor: colors.overlayWeak }),
        fullWidth && styles.fullWidth,
        disabled && styles.inactive,
        typeof styleOverride === 'function'
          ? styleOverride(state)
          : styleOverride,
      ]}
      {...pressableProps}>
      {content}
    </Pressable>
  );
});
