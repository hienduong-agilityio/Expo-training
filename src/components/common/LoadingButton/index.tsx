import { useMemo } from 'react';

// Components
import { ActivityIndicator, Text, View } from 'react-native';

// Components
import { Button } from '@app/components/common/Button';

// Enums
import { BUTTON_COLORS, BUTTON_VARIANTS } from '@app/enums';

// Helpers
import { getButtonStyles, getSizeMetrics } from '@app/helpers/ui';

// Styles
import { styles } from './index.style';

// Types
import type { ILoadingButtonProps } from '@app/interfaces';

export const LoadingButton = ({
  label,
  loadingLabel = 'Loading...',
  loading = false,
  disabled = false,
  size = 'lg',
  variant = BUTTON_VARIANTS.SOLID,
  color = BUTTON_COLORS.PRIMARY,
  selected,
  ...buttonProps
}: ILoadingButtonProps) => {
  const sizeMetrics = getSizeMetrics(size);
  const { labelStyle } = getButtonStyles(variant, color, selected);

  const isDisabled = disabled || loading;

  const loadingContent = useMemo(
    () => (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={labelStyle.color} />
        <Text
          style={[
            styles.base,
            { fontSize: sizeMetrics.fontSize },
            labelStyle,
            styles.loadingText,
          ]}
          numberOfLines={1}>
          {loadingLabel}
        </Text>
      </View>
    ),
    [labelStyle, sizeMetrics.fontSize, loadingLabel],
  );

  return (
    <Button
      {...buttonProps}
      label={loading ? undefined : label}
      children={loading ? loadingContent : undefined}
      disabled={isDisabled}
      size={size}
      variant={variant}
      color={color}
      selected={selected}
    />
  );
};
