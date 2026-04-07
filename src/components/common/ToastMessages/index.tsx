// Components
import { View, Text, TouchableOpacity } from 'react-native';

// Styles
import { styles } from './index.style';

// Constants
import {
  POSITION,
  STATUS,
  TOAST_COLOR_BY_STATUS,
  TOAST_ICON_BY_STATUS,
} from '@app/constants';

// Types
import type { TStatus, TPosition } from '@app/interfaces';
import type { ICustomStyles } from '@app/interfaces/style';

export interface IToastMessagesProps {
  visible: boolean;
  message: string;
  position?: TPosition;
  type?: TStatus;
  onClose?: () => void;
  customStyle?: ICustomStyles;
}

export const ToastMessages = ({
  visible,
  message,
  position = POSITION.TOP,
  type = STATUS.ERROR,
  onClose,
  customStyle,
}: IToastMessagesProps) => {
  if (!visible) return null;

  const isBottom = position === POSITION.BOTTOM;
  const variantColor = TOAST_COLOR_BY_STATUS[type];

  return (
    <View
      style={[
        styles.container,
        isBottom && styles.containerBottom,
        customStyle?.container,
      ]}
      accessibilityRole="alert"
      accessibilityLabel="Toast message">
      {/* Accent bar */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: variantColor },
          customStyle?.accentBar,
        ]}
      />

      {/* Icon */}
      <View style={[styles.iconContainer, customStyle?.iconContainer]}>
        {TOAST_ICON_BY_STATUS[type]({ size: 20, color: variantColor })}
      </View>

      {/* Message */}
      <View style={[styles.messageContainer, customStyle?.messageContainer]}>
        <Text style={[styles.message, customStyle?.message]} numberOfLines={2}>
          {message}
        </Text>
      </View>

      {/* Actions */}
      <View style={[styles.actionsContainer, customStyle?.actionsContainer]}>
        <TouchableOpacity
          style={[styles.closeButton, customStyle?.closeButton]}
          onPress={onClose}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close toast">
          <Text style={[styles.closeText, customStyle?.closeText]}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
