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
  ...pressableProps
}) {
  const sizeMetrics = getSizeMetrics(size);
  const { containerStyle, labelStyle, isSolid } = getButtonStyles(variant);

  const content = children || (
    <Text
      style={[styles.label, { fontSize: sizeMetrics.fontSize }, labelStyle]}
      numberOfLines={1}>
      {label}
    </Text>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        {
          height: sizeMetrics.height,
          paddingHorizontal: sizeMetrics.paddingHorizontal,
        },
        containerStyle,
        pressed &&
          (isSolid
            ? { backgroundColor: colors.primaryDark }
            : { backgroundColor: colors.overlayWeak }),
        fullWidth && styles.fullWidth,
        disabled && styles.inactive,
      ]}
      {...pressableProps}>
      {content}
    </Pressable>
  );
});
