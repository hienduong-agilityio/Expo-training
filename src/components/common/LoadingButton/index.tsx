// Components
import { ActivityIndicator, Text, View } from 'react-native';
import { Button } from '@app/components/common/Button';

// Enums
import { BUTTON_VARIANTS } from '@app/enums';

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
  size = 'md',
  variant = BUTTON_VARIANTS.SOLID,
  fullWidth,
  onPress,
  ...buttonProps
}: ILoadingButtonProps) => {
  const sizeMetrics = getSizeMetrics(size);
  const { labelStyle } = getButtonStyles(variant);

  const isDisabled = disabled || loading;

  const loadingContent = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color={labelStyle.color}
          testID="loading-indicator"
        />
        <Text
          style={[
            styles.label,
            { fontSize: sizeMetrics.fontSize },
            labelStyle,
            styles.loadingText,
          ]}
          numberOfLines={1}>
          {loadingLabel}
        </Text>
      </View>
    );
  };

  return (
    <Button
      {...buttonProps}
      {...(loading ? { children: loadingContent() } : { label })}
      disabled={isDisabled}
      size={size}
      variant={variant}
      fullWidth={fullWidth}
      onPress={onPress}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    />
  );
};
