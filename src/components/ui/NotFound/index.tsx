import { View, Text, TouchableOpacity } from 'react-native';

// Types
import type { INotFoundProps } from '@app/interfaces';

// Icons
import { WarningIcon } from '@app/icons';

// Themes
import { iconSize } from '@app/themes';

// Styles
import { styles } from './index.style';

export const NotFound = ({
  icon,
  title = 'Something went wrong',
  description,
  retryLabel = 'Try Again',
  styleOverrides,
  onRetry,
}: INotFoundProps) => {
  return (
    <View style={[styles.container, styleOverrides?.container]}>
      {/* Icon */}
      <View style={[styles.icon, styleOverrides?.icon]}>
        {icon ?? <WarningIcon size={iconSize['6xl']} />}
      </View>

      {/* Title */}
      <Text style={[styles.title, styleOverrides?.title]}>{title}</Text>

      {/* Description */}
      {description && (
        <Text style={[styles.description, styleOverrides?.description]}>
          {description}
        </Text>
      )}

      {/* Retry Button */}
      {onRetry && (
        <TouchableOpacity
          style={[styles.button, styleOverrides?.button]}
          onPress={onRetry}
          activeOpacity={0.7}>
          <Text style={styles.text}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
