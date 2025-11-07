// Constants
import { MESSAGES } from '@app/constants';

// Components
import { View, Text, TouchableOpacity } from 'react-native';

// Icons
import { RightArrowIcon } from '@app/icons';

// Themes
import { colors } from '@app/themes';

// Styles
import { styles } from './index.style';

// Types
import type { IconProps } from '@app/interfaces';
import type { ComponentType } from 'react';
import type { ICustomStyles } from '@app/interfaces/style';

interface IPromoBannerProps {
  title: string;
  label?: string;
  Icon?: ComponentType<IconProps>;
  actionLabel?: string;
  showActionArrow?: boolean;
  customStyle?: ICustomStyles;
  onPressViewAll?: () => void;
}

export const PromoBanner = ({
  title,
  label,
  Icon,
  actionLabel,
  onPressViewAll,
  customStyle,
  showActionArrow = true,
}: IPromoBannerProps) => {
  const rightContent = onPressViewAll && (
    <TouchableOpacity
      style={[styles.actionButton, customStyle?.actionButton]}
      onPress={onPressViewAll}>
      <View style={styles.actionContent}>
        <Text style={[styles.actionText, customStyle?.actionText]}>
          {actionLabel ?? MESSAGES.VIEW_ALL}
        </Text>
        {showActionArrow && <RightArrowIcon size={14} color={colors.white} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, customStyle?.container]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, customStyle?.title]}>{title}</Text>

        {(label || Icon) && (
          <View style={[styles.labelContainer, customStyle?.labelContainer]}>
            {Icon && <Icon />}
            {label && (
              <Text style={[styles.labelText, customStyle?.labelText]}>
                {label}
              </Text>
            )}
          </View>
        )}
      </View>

      {rightContent}
    </View>
  );
};
