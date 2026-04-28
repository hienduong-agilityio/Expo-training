import React from 'react';
import { StyleSheet, View } from 'react-native';

// Icons
import {
  CartIcon,
  HeartIcon,
  HomeIcon,
  SearchIcon,
  SettingIcon,
} from '@app/icons';

// Types
import type { IconProps } from '@app/interfaces';

// Themes
import { colors } from '@app/themes/colors';
import { borderRadius, spacing } from '@app/themes';

const createTabIcon =
  (IconComponent: React.FC<IconProps>) =>
  ({ color, size }: IconProps) => (
    <IconComponent width={size} height={size} color={color} />
  );

export const TAB_ICONS = {
  HOME: createTabIcon(HomeIcon),
  WISHLIST: createTabIcon(HeartIcon),
  CART: ({
    size = 24,
    focused,
  }: {
    focused: boolean;
    color: string;
    size?: number;
  }) => {
    const containerBackgroundColor = focused ? colors.primary : colors.white;
    const iconColor = focused ? colors.white : colors.grayDark;

    return (
      <View
        style={[
          styles.cartIconContainer,
          { backgroundColor: containerBackgroundColor },
        ]}>
        <CartIcon width={size} height={size} color={iconColor} />
      </View>
    );
  },
  SEARCH: createTabIcon(SearchIcon),
  SETTINGS: createTabIcon(SettingIcon),
} as const;

const styles = StyleSheet.create({
  cartIconContainer: {
    width: spacing['12.5'],
    height: spacing['12.5'],
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: spacing['0.5'], height: spacing['1.25'] },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: spacing['5'],
    marginTop: -spacing['3.5'],
  },
});
