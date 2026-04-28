// Constants
import { MESSAGES } from '@app/constants';

// Components
import { View, Text, TouchableOpacity } from 'react-native';

// Icons
import { RightArrowIcon } from '@app/icons';

// Themes
import { colors } from '@app/themes';

// Styles
import { styles, getHeaderStyle } from './index.style';

// Types
import type { IconProps } from '@app/interfaces';
import type { ComponentType } from 'react';
import type { ICustomStyles } from '@app/interfaces/style';
import type { HeaderStyle } from '@app/interfaces/ui';

export interface IPromoBannerProps {
  title: string;
  subtitle?: string;
  label?: string;
  Icon?: ComponentType<IconProps>;
  actionLabel?: string;
  showActionArrow?: boolean;
  headerStyle?: HeaderStyle;
  customStyle?: ICustomStyles;
  onPressViewAll?: () => void;
}

export const PromoBanner = ({
  title,
  subtitle,
  label,
  Icon,
  actionLabel,
  onPressViewAll,
  customStyle,
  showActionArrow = true,
  headerStyle = 'deal',
}: IPromoBannerProps) => {
  const headerStyles = getHeaderStyle(headerStyle);

  const rightContent = onPressViewAll && (
    <TouchableOpacity
      style={[headerStyles.actionButton, customStyle?.actionButton]}
      onPress={onPressViewAll}>
      <View style={styles.actionContent}>
        <Text style={[headerStyles.actionText, customStyle?.actionText]}>
          {actionLabel ?? MESSAGES.VIEW_ALL}
        </Text>
        {showActionArrow && <RightArrowIcon size={14} color={colors.white} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[headerStyles.container, customStyle?.container]}>
      <View style={styles.titleContainer}>
        <Text style={[headerStyles.title, customStyle?.title]}>{title}</Text>

        {subtitle && (
          <Text style={[headerStyles.subtitle, customStyle?.subtitle]}>
            {subtitle}
          </Text>
        )}

        {(label || Icon) && (
          <View style={[styles.labelContainer, customStyle?.labelContainer]}>
            {Icon && <Icon size={14} color={colors.white} />}
            {label && (
              <Text style={[headerStyles.labelText, customStyle?.labelText]}>
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
