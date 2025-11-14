import { memo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  type TextInputProps,
} from 'react-native';

// Themes
import { colors } from '@app/themes';

// Enums
import { TEXTFIELD_VARIANTS } from '@app/enums';

// Helpers
import { ComponentSize, getSizeMetrics } from '@app/helpers';

// Styles
import { styles } from './index.style';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isSecureText?: boolean;
  variant?: TEXTFIELD_VARIANTS;
  onRightPress?: () => void;
  size?: ComponentSize;
}

export const TextField = memo<TextFieldProps>(function TextField({
  label,
  error,
  leftIcon,
  rightIcon,
  isSecureText = false,
  variant = TEXTFIELD_VARIANTS.OUTLINED,
  size = 'md',
  style,
  onRightPress,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const sizeMetrics = getSizeMetrics(size);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;

    return colors.border;
  };

  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    return <View style={styles.leftIcon}>{leftIcon}</View>;
  };

  const renderRightIcon = () => {
    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={() => (onRightPress ? onRightPress() : setShowPassword(!showPassword))}
          activeOpacity={0.7}>
          {rightIcon}
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={styles.containerSpacing}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            height: sizeMetrics.height,
            borderColor: getBorderColor(),
          },
          variant === TEXTFIELD_VARIANTS.FILLED && {
            backgroundColor: colors.surfaceVariant,
          },
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}>
        {renderLeftIcon()}

        <TextInput
          style={[
            styles.input,
            {
              fontSize: sizeMetrics.fontSize,
              paddingHorizontal: sizeMetrics.paddingHorizontal,
            },
            style,
          ]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isSecureText && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {renderRightIcon()}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});
